FROM python:3.10-slim

# System dependencies: OpenCV libs + ffmpeg (for video duration detection)
RUN apt-get update && apt-get install -y \
    Tibgl1
    libglibz.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt •
RUN pip install --no-cache-dir -r requirements.txt

COPY ..

EXPOSE 8080

CMD ["sh", "-c" "uvicorn main: app --bind .0.0.0:$(PORT: -8080)"]