# URGENT: Add Google Credentials to Docker Environment

## The Problem
Your backend restarted but Google credentials are missing:
```
WARNING: The GOOGLE_CLIENT_ID variable is not set. Defaulting to a blank string.
WARNING: The GOOGLE_CLIENT_SECRET variable is not set. Defaulting to a blank string.
```

## Fix It NOW on Oracle Server

### 1. Create/Edit `.env` file in the root directory
```bash
cd ~/synqq
nano .env
```

### 2. Add these lines:
```env
GOOGLE_CLIENT_ID=335846643539-am8i2gne8ajsu3sbgfomb61pp26dr6ir.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
FRONTEND_URL=https://dozzl.xyz
SECRET_KEY=secretss
DB_USER=postgres
DB_PASSWORD=joe123
DB_HOST=synq-db
DB_PORT=5432
DB_NAME=synq
```

### 3. Restart Docker Compose
```bash
docker-compose down
docker-compose up -d
```

### 4. Verify it worked
```bash
docker-compose logs backend | grep GOOGLE
```

Should NOT show warnings anymore!

### 5. Test Google Auth
Go to https://dozzl.xyz/login and click "Continue with Google"

## Why This Happened
Docker Compose needs a `.env` file in the project root to pass environment variables to containers. The `Backend/.env` file is only for local development, not Docker.