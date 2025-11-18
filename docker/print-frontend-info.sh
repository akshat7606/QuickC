#!/bin/sh
# Prints helpful URLs and waits for backend readiness so the container logs show the link

echo "\n=== QuickC Frontend Startup Info ==="
# Suggest host URLs (Docker Desktop/Compose typical)
echo "Frontend (nginx) will be served on: http://localhost:80"
echo "Backend (api) is expected on: http://localhost:8000"

echo "Checking backend (app) availability inside the Docker network..."
TRY=0
MAX=15
while [ $TRY -lt $MAX ]; do
  if curl -sS http://app:8000/v1/partner/health >/dev/null 2>&1; then
    echo "Backend is reachable at http://app:8000 (from container)."
    echo "You can access the frontend at http://localhost/ and the API at http://localhost:8000"
    break
  else
    TRY=$((TRY+1))
    echo "Waiting for backend (app:8000) to be ready... ($TRY/$MAX)"
    sleep 1
  fi
done

if [ $TRY -ge $MAX ]; then
  echo "Warning: backend (app:8000) did not become reachable within ${MAX} seconds. Frontend will still start, but API calls may fail until the backend is ready."
fi

echo "=== End Startup Info ===\n"

exit 0

