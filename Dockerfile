# Armado de la imagen Angular para hosting tradicional con Nginx.
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/mi-primer-proyecto/browser/ /usr/share/nginx/html/

# Angular SSR genera index.csr.html en la salida browser; Nginx SPA espera index.html.
RUN if [ -f /usr/share/nginx/html/index.csr.html ] && [ ! -f /usr/share/nginx/html/index.html ]; then cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; fi

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
