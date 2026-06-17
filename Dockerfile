# Multi-stage build for the Obsidian File Viewer

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (both production and dev) - needed for building
RUN npm install

# Copy source code
COPY . .

# Same-origin by default: an empty base URL makes the SPA call relative /api/*,
# which the production nginx proxies to the backend. Override per-deployment with
# --build-arg REACT_APP_API_BASE_URL=https://api.example.com if the API is remote.
ARG REACT_APP_API_BASE_URL=""
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build the React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built React app to nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Runtime-templated server config. The base image's entrypoint runs envsubst over
# /etc/nginx/templates/*.template at start, substituting ${API_UPSTREAM}.
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Default backend; override at runtime, e.g. -e API_UPSTREAM=host.docker.internal:9000
ENV API_UPSTREAM=127.0.0.1:9000

# Expose port 80
EXPOSE 80

# Health check (nginx:alpine ships wget, not curl)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

# Base image provides ENTRYPOINT (envsubst templating) and CMD (nginx daemon off).
