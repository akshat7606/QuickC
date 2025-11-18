# Multi-stage Dockerfile: build frontend with Node, then install backend and copy frontend build

# Frontend build stage
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Accept build arg for Vite env var (Vite expects variables prefixed with VITE_)
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

# Copy package files first for better caching
COPY frontend/package.json frontend/package-lock.json* ./
COPY frontend/tsconfig*.json ./

# Copy the rest of the frontend sources
COPY frontend/ .

# Install deps (try npm ci, fallback to npm install if package-lock missing)
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Build the frontend
RUN npm run build

# Backend stage
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies needed for some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    curl \
  && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy built frontend from the frontend-builder stage into the image
# Vite outputs to `dist` by default. Copy `dist` into `frontend/build` so
# the FastAPI backend (which expects `frontend/build`) can serve the SPA.
COPY --from=frontend-builder /app/frontend/dist ./frontend/build

EXPOSE 8000

# Default command to run the FastAPI app (serves the frontend build)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
