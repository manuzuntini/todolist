# Frontend (Vue 3 + Vuetify + Pinia + Supabase)

## Env
Create `.env` from `.env.example` and fill in the Supabase keys. For development, `VITE_API_BASE_URL` should point to your running backend (e.g., http://localhost:3000/api).

## Run
```powershell
cd frontend
npm install
npm run dev
```

## Notes
- Login is implemented via Supabase Google OAuth.
- The `auth` Pinia store keeps the session and exposes `signInWithGoogle` and `signOut`.
- The frontend sends the Supabase access token as `Authorization: Bearer <token>` to the backend, which validates the token and performs actions using the Supabase Service Role key.
