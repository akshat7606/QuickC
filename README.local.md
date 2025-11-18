Local development README

This README explains how to run the QuickC backend and frontend together on your local machine (without Docker).

Prerequisites
- macOS or Linux
- python3 (>=3.8)
- node and npm
- git (optional)
- tmux (optional, recommended)

Files
- `start-dev.sh` — convenience script that creates a Python virtualenv (if missing), installs Python + Node deps, and starts the backend and frontend.
  - If `tmux` is installed the script creates a `tmux` session named `quickc-dev` with two panes (backend + frontend).
  - If `tmux` is not available it starts both services in the background and writes logs to `.dev_logs/`.

Quick start (recommended)
1. From the project root run:

```bash
./start-dev.sh
```

2. If `tmux` is available you'll see a message with how to attach:

```bash
tmux attach -t quickc-dev
```

3. Otherwise find logs in `.dev_logs/backend.log` and `.dev_logs/frontend.log`.

Ports
- Backend (FastAPI / uvicorn): http://localhost:8000
- Frontend (Vite dev): http://localhost:5173

Environment variable
- `VITE_API_URL` — default: `http://localhost:8000`.
  - The script respects an existing `VITE_API_URL` environment variable. To override:

```bash
VITE_API_URL=http://your-api:8000 ./start-dev.sh
```

Stopping
- If running in `tmux`, attach and then stop each process with Ctrl+C, or kill the session:

```bash
tmux kill-session -t quickc-dev
```

- If running in background mode the PIDs are saved in `.dev_logs/backend.pid` and `.dev_logs/frontend.pid`.

```bash
kill "$(cat .dev_logs/backend.pid)" "$(cat .dev_logs/frontend.pid)"
```

Notes
- The script will create a `.venv` directory for a Python virtualenv. If you prefer a system Python or a different venv path, edit the script accordingly.
- For production testing you can build the frontend with `cd frontend && npm run build` and then run the backend (it expects the built assets at `frontend/build`).

If you'd like, I can also add a `Makefile` with targets for `dev`, `build-frontend`, and `start-prod`.
