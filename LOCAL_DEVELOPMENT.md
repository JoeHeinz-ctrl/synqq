# Local Development Setup

## Quick Fix for CORS and Login Issues

### 1. Backend Setup
```bash
cd Backend
python run.py
```
Backend will run on `http://localhost:8000`

### 2. Frontend Setup
```bash
cd frountent
npm run dev
```
Frontend will run on `http://localhost:5173`

### 3. Environment Configuration

**Frontend** uses `.env.local` for local development:
```
VITE_API_URL=http://localhost:8000
```

**Backend** CORS is configured to allow:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative)
- `http://127.0.0.1:5173` (Alternative localhost)
- `http://127.0.0.1:3000` (Alternative localhost)

### 4. Fixed Issues

✅ **Login Card Alignment**: Changed back to `alignItems: "center"` for proper vertical centering
✅ **CORS Errors**: Added localhost variants to backend CORS configuration
✅ **API URL**: Created `.env.local` for local development pointing to `localhost:8000`

### 5. Google OAuth

For Google OAuth to work locally, you need to:
1. Add `http://localhost:5173` to Google Cloud Console authorized origins
2. Or use email/password login for local testing

### 6. Production vs Development

- **Production**: Uses `.env` with `https://api.dozzl.xyz`
- **Development**: Uses `.env.local` with `http://localhost:8000`

Vite automatically prioritizes `.env.local` over `.env` in development.