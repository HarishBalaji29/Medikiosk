import httpx
import uuid
from datetime import datetime


class SupabaseStorage:
    """Upload files to Supabase Storage via REST API."""

    def __init__(self, supabase_url: str, service_key: str, bucket: str = "prescriptions"):
        self.base_url = f"{supabase_url}/storage/v1"
        self.bucket = bucket
        self.headers = {
            "Authorization": f"Bearer {service_key}",
            "apikey": service_key,
        }

    def upload_image(self, image_bytes: bytes, filename: str = None, content_type: str = "image/jpeg") -> dict:
        """
        Upload an image to Supabase Storage bucket.
        Returns dict with 'url' (public URL) and 'path' (storage path).
        """
        try:
            # Generate unique filename
            if not filename:
                ext = "jpg" if "jpeg" in content_type else content_type.split("/")[-1] if content_type else "jpg"
                filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{ext}"

            storage_path = f"uploads/{filename}"

            # Upload via REST API
            upload_url = f"{self.base_url}/object/{self.bucket}/{storage_path}"
            response = httpx.post(
                upload_url,
                headers={
                    **self.headers,
                    "Content-Type": content_type,
                },
                content=image_bytes,
                timeout=30.0,
            )

            if response.status_code in (200, 201):
                # Get public URL
                public_url = f"{self.base_url}/object/public/{self.bucket}/{storage_path}"
                return {
                    "url": public_url,
                    "path": storage_path,
                    "error": None,
                }
            else:
                error_detail = response.text
                return {
                    "url": None,
                    "path": None,
                    "error": f"Upload failed ({response.status_code}): {error_detail}",
                }

        except Exception as e:
            return {
                "url": None,
                "path": None,
                "error": f"Upload error: {str(e)}",
            }

    def delete_image(self, storage_path: str) -> bool:
        """Delete an image from Supabase Storage."""
        try:
            url = f"{self.base_url}/object/{self.bucket}/{storage_path}"
            response = httpx.delete(url, headers=self.headers, timeout=10.0)
            return response.status_code in (200, 204)
        except:
            return False
