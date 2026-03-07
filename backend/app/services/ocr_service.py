import io
import re
import numpy as np
from PIL import Image

# ─── Singleton EasyOCR Reader ───
_reader = None


def get_reader():
    """Initialize EasyOCR Reader once (downloads models on first run ~100MB)."""
    global _reader
    if _reader is None:
        import easyocr
        print("[OCR] Initializing EasyOCR (first run downloads models)...")
        _reader = easyocr.Reader(['en'], gpu=False)
        print("[OCR] EasyOCR ready.")
    return _reader


def extract_text(image_bytes: bytes) -> dict:
    """
    Extract text from image bytes using EasyOCR.
    Returns dict with 'text', 'lines', and 'confidence'.
    """
    try:
        reader = get_reader()

        # Open and convert image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_np = np.array(image)

        # Run OCR
        results = reader.readtext(image_np)

        if not results:
            return {"text": "", "lines": [], "confidence": 0, "error": "No text detected in image"}

        # Sort by vertical position (top-to-bottom reading order)
        results.sort(key=lambda r: (r[0][0][1], r[0][0][0]))

        # Group text into lines based on vertical proximity
        lines = []
        current_line_parts = []
        prev_y = None
        line_threshold = 20  # pixels

        for bbox, text, conf in results:
            top_y = bbox[0][1]
            if prev_y is not None and abs(top_y - prev_y) > line_threshold:
                lines.append(' '.join(current_line_parts))
                current_line_parts = []
            current_line_parts.append(text)
            prev_y = top_y

        if current_line_parts:
            lines.append(' '.join(current_line_parts))

        full_text = '\n'.join(lines)
        avg_confidence = sum(r[2] for r in results) / len(results) * 100

        return {
            "text": full_text,
            "lines": lines,
            "confidence": round(avg_confidence, 1),
            "error": None,
        }

    except Exception as e:
        return {"text": "", "lines": [], "confidence": 0, "error": str(e)}


def parse_medicines(text: str) -> list:
    """
    Best-effort extraction of medicine names from OCR text.
    Looks for lines containing dosage patterns (mg, ml, etc.)
    """
    medicines = []
    lines = text.split('\n')

    # Pattern to detect dosage mentions
    dosage_re = re.compile(r'(\d+\.?\d*)\s*(mg|mcg|ml|g|%|iu|units)', re.IGNORECASE)
    # Pattern to detect frequency
    freq_re = re.compile(r'(\d-\d-\d|\b(?:once|twice|thrice|daily|bd|tds|qid|od|hs|sos|prn|stat)\b)', re.IGNORECASE)
    # Pattern to detect duration
    dur_re = re.compile(r'(\d+)\s*(days?|weeks?|months?)', re.IGNORECASE)
    # Medicine form prefixes
    form_re = re.compile(r'\b(Tab\.?|Cap\.?|Syp\.?|Inj\.?|Cream|Oint\.?|Drop|Susp\.?|Gel)\b', re.IGNORECASE)

    # Skip keywords (non-medicine lines)
    skip_keywords = [
        'dr.', 'dr ', 'doctor', 'patient', 'name:', 'date:', 'age:',
        'reg.', 'registration', 'address', 'phone', 'clinic', 'hospital',
        'mbbs', 'md ', 'ms ', 'prescription', 'diagnosis', 'signature',
    ]

    for line in lines:
        stripped = line.strip()
        if not stripped or len(stripped) < 4:
            continue

        # Skip header/footer lines
        if any(kw in stripped.lower() for kw in skip_keywords):
            continue

        # A line is likely a medicine line if it has dosage info or a medicine form prefix
        has_dosage = dosage_re.search(stripped)
        has_form = form_re.search(stripped)

        if has_dosage or has_form:
            # Extract dosage
            dosage_match = dosage_re.search(stripped)
            dosage = f"{dosage_match.group(1)}{dosage_match.group(2)}" if dosage_match else ""

            # Extract frequency
            freq_match = freq_re.search(stripped)
            frequency = freq_match.group(1) if freq_match else ""

            # Extract duration
            dur_match = dur_re.search(stripped)
            duration = f"{dur_match.group(1)} {dur_match.group(2)}" if dur_match else ""

            # Extract medicine name (text before dosage, excluding form prefix)
            name = stripped
            if dosage_match:
                name = stripped[:dosage_match.start()].strip()
            # Remove form prefix from name for cleaner display
            name = form_re.sub('', name).strip()
            # Remove leading numbers like "1." or "1)"
            name = re.sub(r'^\d+[\.\)\-]\s*', '', name).strip()

            if len(name) < 2:
                name = stripped  # fallback to full line

            medicines.append({
                "name": name,
                "dosage": dosage,
                "frequency": frequency,
                "duration": duration,
                "raw_line": stripped,
                "available": True,
                "price": round(2.0 + len(name) * 0.5, 2),  # placeholder price
            })

    return medicines
