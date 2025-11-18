#!/usr/bin/env bash
set -euo pipefail

# start-dev.sh — start backend (uvicorn) and frontend (Vite) for local development
# - uses tmux if available (recommended)
# - otherwise starts both in background and writes logs to .dev_logs/

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

: "${VITE_API_URL:=http://localhost:8000}"
LOG_DIR="$ROOT_DIR/.dev_logs"
mkdir -p "$LOG_DIR"

# Create & activate venv if missing, install Python deps
if [ ! -d ".venv" ]; then
  echo ".venv not found — creating virtualenv and installing Python deps"
  python3 -m venv .venv
  # shellcheck disable=SC1091
  . .venv/bin/activate
  python -m pip install --upgrade pip setuptools wheel
  python -m pip install -r requirements.txt
else
  # shellcheck disable=SC1091
  . .venv/bin/activate
fi

# Ensure Node deps
if [ ! -d "node_modules" ]; then
  echo "Installing root node deps..."
  npm ci --no-audit --no-fund
fi
if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend node deps..."
  (cd frontend && npm ci --silent || npm install --silent)
fi

SESSION="quickc-dev"

# If tmux is available, create a session with two panes (backend + frontend)
if command -v tmux >/dev/null 2>&1; then
  if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "A tmux session named '$SESSION' already exists. Attach with: tmux attach -t $SESSION"
    exit 0
  fi

  echo "Starting services in a new tmux session: $SESSION"
  tmux new-session -d -s "$SESSION" -n backend

  # pane 0: backend
  tmux send-keys -t "$SESSION:0.0" "export VITE_API_URL='$VITE_API_URL' && . .venv/bin/activate && .venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload 2>&1 | tee $LOG_DIR/backend.log" C-m

  # split and start frontend in pane 1
  tmux split-window -h -t "$SESSION:0"
  tmux send-keys -t "$SESSION:0.1" "export VITE_API_URL='$VITE_API_URL' && cd frontend && npm run dev -- --host 0.0.0.0 --port 5173 2>&1 | tee $LOG_DIR/frontend.log" C-m

  tmux select-pane -t "$SESSION:0.0"
  echo "Started backend and frontend in tmux session '$SESSION'. Attach with: tmux attach -t $SESSION"
  echo "Logs: $LOG_DIR/backend.log and $LOG_DIR/frontend.log"
  exit 0
fi

# Fallback: start both services in background and write logs
echo "tmux not found; starting services in background and writing logs to $LOG_DIR"

# start backend
nohup bash -lc ". .venv/bin/activate && .venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload" > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "$BACKEND_PID" > "$LOG_DIR/backend.pid"

sleep 1

# start frontend (in project frontend dir)
nohup bash -lc "cd frontend && export VITE_API_URL='$VITE_API_URL' && npm run dev -- --host 0.0.0.0 --port 5173" > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "$FRONTEND_PID" > "$LOG_DIR/frontend.pid"

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Logs: $LOG_DIR/backend.log and $LOG_DIR/frontend.log"
echo "To stop: kill \\$(cat $LOG_DIR/backend.pid) \\$(cat $LOG_DIR/frontend.pid)"

