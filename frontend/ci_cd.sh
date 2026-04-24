build -t medikiosk-frontend:v1.0.
docker tag medikiosk-frontend:v1.0 us-central1-docker.pkg.dev/gcpopenshift/decode-microservice/medikiosk-frontend:v1.0
docker push us-central1-docker.pkg.dev/gcpopenshift/decode-microservice/medikiosk-frontend:v1.0
gcloud run deploy medikiosk-frontend --image us-central1-docker.pkg.dev/gpopenshift/decode-microservice/medikiosk-frontend:v1.0 - -region us-centrall --use-http2 --platform managed --allow-unauthenticated --timeout=800s