# MERN Backend (Node.js + Express)

## Setup

1. Copy `.env.example` to `.env` and adjust values if needed:
   ```bash
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server in dev mode:
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000` by default.

## Endpoints

- GET `/api/health` → returns `{ ok: true, service: 'backend', timestamp: ... }`

## Notes

- CORS is restricted to `CORS_ORIGIN`. Set this to your frontend dev URL.
- Uses `morgan` for request logging and a simple JSON error handler.
