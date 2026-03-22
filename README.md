# LermoAI

AI Agent for Personalized Learning


https://github.com/user-attachments/assets/0e71f134-708e-458c-b0a9-6b56ee3c4cf2


# Getting Started

## Project Structure

- **Frontend**: React + TypeScript + Vite (`apps/frontend/web`)
- **Backend**: FastAPI + Python (`apps/backend/agent-api`)
- **Storage**: Folder-based at `apps/backend/agent-api/storage`


## Docker Compose

```sh
docker compose up
```

## Commands

### Root (Monorepo)

```bash
pnpm install          # Install all dependencies
pnpm dev              # Run frontend + backend in parallel
```

### Frontend

```bash
cd apps/frontend/web

pnpm dev              # Development server (http://localhost:3000)
```

### Backend

```bash
cd apps/backend/agent-api

# Install dependencies
pip install -r requirements.txt

# Run development server (auto-reload)
pnpm dev              # http://localhost:8000

```
