# Backend (Express + Supabase)

This backend is a simple Express.js API that uses Supabase for persistence and authentication.

## Environment variables
Copy `.env.example` to `.env` and set the values in your environment.

- SUPABASE_URL - your project Supabase URL
- SUPABASE_SERVICE_ROLE_KEY - your service role key (use with caution)
- PORT - optional, defaults to 3000

## Endpoints
- GET /api/ping — health check
- GET /api/me — get authenticated user info (requires Bearer token)
- GET /api/tasks — get tasks for logged-in user
- POST /api/tasks — create new task (body: { title, completed })
- PUT /api/tasks/:id — update task
- DELETE /api/tasks/:id — delete task

## Run
```powershell
cd backend
npm install
npm run dev
```
