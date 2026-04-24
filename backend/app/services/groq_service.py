"""
Groq AI Service — Uses Llama 4 Scout (Vision) to directly read prescription images
with high accuracy, falling back to text-only structuring of OCR output.
"""

import json
import base64
import httpx

# ─── Groq API endpoint (OpenAI-compatible) ───
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# ─── Vision model for direct image reading ───
VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# ─── System prompt for prescription structuring ───
SYSTEM_PROMPT = """You are a medical prescription parser and OCR expert. Your job is to read and extract information from a prescription image accurately.

You must extract:
1. Doctor's name, qualifications, clinic/hospital details
2. Patient's name
3. Date on the prescription
4. Diagnosis (if mentioned)
5. ALL medicines with their details

For each medicine, extract:
- name: The medicine/drug name (e.g., "Oflazest OZ", "Azenac MR", "Andial", "Zofer")
- form: The form — look for Tab/Tab., Cap/Cap., Syp/Syp., Inj., Cream, Drops, etc.
- dosage: Strength/dose if visible (e.g., "500mg", "250mg")
- quantity: Number of tablets/units prescribed (the number in parentheses or written next to the medicine)
- frequency: How often to take — look for patterns like "1——1" meaning morning-evening, or "1——1——1" meaning three times, or BD, TDS, OD, etc.
- duration: How long to take (e.g., "3 days", "5 days", "1 week")
- instructions: Special instructions like "after food", "before bed", etc.

Common prescription abbreviations:
- Tab = Tablet, Cap = Capsule, Syp = Syrup, Inj = Injection
- OD = Once Daily, BD = Twice Daily, TDS = Three Times Daily
- "1—1" = morning and evening, "1—1—1" = morning, afternoon, evening
- Numbers in parentheses like (6) or (5) usually indicate total quantity

Return ONLY a valid JSON object in this exact format:
{
  "cleaned_text": "The complete prescription text as you read it from the image",
  "doctor_name": "Doctor name with qualifications",
  "patient_name": "Patient name if found",
  "date": "Prescription date if found",
  "diagnosis": "Diagnosis if mentioned",
  "medicines": [
    {
      "name": "Medicine Name",
      "form": "tablet",
      "dosage": "",
      "quantity": "6",
      "frequency": "1-0-1",
      "duration": "3 days",
      "instructions": ""
    }
  ]
}

Rules:
- Return ONLY valid JSON, no markdown, no explanation, no extra text
- Read the handwritten text carefully — doctor handwriting can be challenging
- If a field is not clearly visible, use an empty string ""
- Try to identify ALL medicines even if partially legible
- Use your medical knowledge to correct likely medicine names
- Numbers next to medicine names in parentheses usually indicate quantity"""


# ─── System prompt for text-only structuring (fallback) ───
TEXT_SYSTEM_PROMPT = """You are a medical prescription parser. Your job is to take raw OCR text extracted from a prescription image and return clean, structured data.

The OCR text may contain:
- Misspellings, broken words, or garbled characters from handwriting
- Doctor/patient information (name, age, date, clinic)
- Medicine names with dosages, frequencies, and durations
- Abbreviations like Tab., Cap., Syp., Inj., OD, BD, TDS, QID, HS, SOS, PRN

Your task:
1. Clean the raw OCR text — fix obvious misspellings and merge broken words
2. Use your medical knowledge to identify actual medicine names from garbled text
3. Extract ALL medicines mentioned

Return ONLY a valid JSON object in this exact format:
{
  "cleaned_text": "The full cleaned/corrected prescription text",
  "doctor_name": "Doctor name if found, else empty string",
  "patient_name": "Patient name if found, else empty string",
  "date": "Prescription date if found, else empty string",
  "diagnosis": "Diagnosis if mentioned, else empty string",
  "medicines": [
    {
      "name": "Medicine Name",
      "form": "tablet",
      "dosage": "500mg",
      "quantity": "",
      "frequency": "1-0-1",
      "duration": "5 days",
      "instructions": "after food"
    }
  ]
}

Rules:
- Return ONLY valid JSON, no markdown, no explanation, no extra text
- If a field is not found in the prescription, use an empty string ""
- Always try to correct obvious OCR errors in medicine names
- If you cannot identify any medicines, return an empty medicines array"""


async def analyze_prescription_image(
    image_bytes: bytes,
    api_key: str,
    content_type: str = "image/jpeg",
) -> dict:
    """
    Send the prescription IMAGE directly to Groq's Vision model (Llama 4 Scout)
    to read and structure it. This bypasses EasyOCR and reads handwriting directly.

    Args:
        image_bytes: Raw image bytes
        api_key: Groq API key
        content_type: MIME type of the image

    Returns:
        dict with structured prescription data, or error info
    """
    if not api_key or api_key.startswith("gsk_YOUR"):
        return {
            "error": "Groq API key not configured",
            "structured": None,
            "used_llm": False,
            "method": "none",
        }

    try:
        # Encode image to base64
        b64_image = base64.b64encode(image_bytes).decode("utf-8")

        # Determine media type
        media_type = content_type if content_type else "image/jpeg"
        if media_type not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
            media_type = "image/jpeg"

        # Check size — Groq has a 4MB limit for base64 images
        if len(b64_image) > 4 * 1024 * 1024:
            print("[Groq Vision] Image too large for vision API (>4MB base64), will use text fallback")
            return {
                "error": "Image too large for vision API",
                "structured": None,
                "used_llm": False,
                "method": "none",
            }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": VISION_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Read this prescription image carefully and extract all information. Pay close attention to handwritten medicine names, quantities, and dosages. Return structured JSON.",
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{media_type};base64,{b64_image}",
                            },
                        },
                    ],
                },
            ],
            "temperature": 0.1,
            "max_tokens": 2048,
            "response_format": {"type": "json_object"},
        }

        print(f"[Groq Vision] Sending prescription image to {VISION_MODEL}...")
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(GROQ_API_URL, headers=headers, json=payload)

        if response.status_code != 200:
            error_detail = response.text[:300]
            print(f"[Groq Vision] API error {response.status_code}: {error_detail}")
            return {
                "error": f"Groq Vision API returned {response.status_code}",
                "structured": None,
                "used_llm": False,
                "method": "none",
            }

        result = response.json()
        content = result["choices"][0]["message"]["content"]

        # Parse JSON response
        structured = json.loads(content)

        # Ensure expected fields exist
        if "medicines" not in structured:
            structured["medicines"] = []

        # Enrich medicine entries
        for med in structured["medicines"]:
            med.setdefault("name", "")
            med.setdefault("form", "")
            med.setdefault("dosage", "")
            med.setdefault("quantity", "")
            med.setdefault("frequency", "")
            med.setdefault("duration", "")
            med.setdefault("instructions", "")
            # Compatibility fields for frontend
            form_label = med["form"].capitalize() if med["form"] else ""
            med["raw_line"] = f"{form_label} {med['name']} {med['dosage']} {med['frequency']} {med['duration']}".strip()
            med["available"] = True
            med["price"] = round(2.0 + len(med["name"]) * 0.5, 2)

        med_count = len(structured["medicines"])
        print(f"[Groq Vision] ✅ Successfully read {med_count} medicines directly from image")

        return {
            "error": None,
            "structured": structured,
            "used_llm": True,
            "method": "vision",
        }

    except json.JSONDecodeError as e:
        print(f"[Groq Vision] Failed to parse JSON response: {e}")
        return {
            "error": f"Invalid JSON from Groq Vision: {str(e)}",
            "structured": None,
            "used_llm": False,
            "method": "none",
        }
    except httpx.TimeoutException:
        print("[Groq Vision] Request timed out")
        return {
            "error": "Groq Vision API request timed out",
            "structured": None,
            "used_llm": False,
            "method": "none",
        }
    except Exception as e:
        print(f"[Groq Vision] Unexpected error: {e}")
        return {
            "error": f"Groq Vision error: {str(e)}",
            "structured": None,
            "used_llm": False,
            "method": "none",
        }


async def structure_prescription_text(
    raw_text: str,
    api_key: str,
    model: str = "llama-3.3-70b-versatile",
) -> dict:
    """
    Fallback: Send raw OCR text to Groq's Llama 3.3 70B to clean and structure it.
    Used when vision model fails or image is too large.

    Args:
        raw_text: The raw text extracted by EasyOCR
        api_key: Groq API key
        model: Groq model to use

    Returns:
        dict with structured prescription data, or error info
    """
    if not api_key or api_key.startswith("gsk_YOUR"):
        return {
            "error": "Groq API key not configured",
            "structured": None,
            "used_llm": False,
        }

    if not raw_text or not raw_text.strip():
        return {
            "error": "No text to structure",
            "structured": None,
            "used_llm": False,
        }

    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": TEXT_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Parse this prescription OCR text and return structured JSON:\n\n{raw_text}",
                },
            ],
            "temperature": 0.1,
            "max_tokens": 2048,
            "response_format": {"type": "json_object"},
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(GROQ_API_URL, headers=headers, json=payload)

        if response.status_code != 200:
            error_detail = response.text[:200]
            print(f"[Groq Text] API error {response.status_code}: {error_detail}")
            return {
                "error": f"Groq API returned {response.status_code}",
                "structured": None,
                "used_llm": False,
            }

        result = response.json()
        content = result["choices"][0]["message"]["content"]

        structured = json.loads(content)

        if "medicines" not in structured:
            structured["medicines"] = []

        for med in structured["medicines"]:
            med.setdefault("name", "")
            med.setdefault("form", "")
            med.setdefault("dosage", "")
            med.setdefault("quantity", "")
            med.setdefault("frequency", "")
            med.setdefault("duration", "")
            med.setdefault("instructions", "")
            form_label = med["form"].capitalize() if med["form"] else ""
            med["raw_line"] = f"{form_label} {med['name']} {med['dosage']} {med['frequency']} {med['duration']}".strip()
            med["available"] = True
            med["price"] = round(2.0 + len(med["name"]) * 0.5, 2)

        print(f"[Groq Text] Successfully structured {len(structured['medicines'])} medicines")

        return {
            "error": None,
            "structured": structured,
            "used_llm": True,
        }

    except json.JSONDecodeError as e:
        print(f"[Groq Text] Failed to parse JSON response: {e}")
        return {
            "error": f"Invalid JSON from Groq: {str(e)}",
            "structured": None,
            "used_llm": False,
        }
    except httpx.TimeoutException:
        print("[Groq Text] Request timed out")
        return {
            "error": "Groq API request timed out",
            "structured": None,
            "used_llm": False,
        }
    except Exception as e:
        print(f"[Groq Text] Unexpected error: {e}")
        return {
            "error": f"Groq error: {str(e)}",
            "structured": None,
            "used_llm": False,
        }
