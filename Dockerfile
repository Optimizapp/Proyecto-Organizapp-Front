# Build Angular SSR application.
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Runtime for the Angular SSR server generated in dist/mi-primer-proyecto/server.
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/mi-primer-proyecto/server/server.mjs"]
