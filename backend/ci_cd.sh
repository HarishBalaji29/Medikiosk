build -t medikiosk-backend:v1.0.
docker tag medikiosk-backend:v1.0 us-central1-docker.pkg.dev/gcpopenshift/decode-microservice/medikiosk-backend:v1.0
docker push us-central1-docker.pkg.dev/gcpopenshift/decode-microservice/medikiosk-backend:v1.0
gcloud run deploy medikiosk-backend --image us-central1-docker.pkg.dev/gpopenshift/decode-microservice/medikiosk-backend:v1.0 - -region us-centrall --use-http2 --platform managed --allow-unauthenticated --timeout=800s