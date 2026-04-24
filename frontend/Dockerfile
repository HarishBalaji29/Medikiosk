FROM node: 20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ・・

RUN node --max-old-space-size=4096 node_modules/.bin/vite build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN printf 'server {\n\ 
    listen 80; \n\
    server_name_;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    # Allow popup-based OAuth flows (Firebase signInWithPopup)\n\
    add_header Cross-Origin-Opener-Policy "same-origin-allow-popups" always;\n\
    location / {\n\
        try_files $uri $uri/ /index.htm1;\n\
    }\n\
}\n' › /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off; "]