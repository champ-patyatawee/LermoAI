from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.api import ping, main
from app.engine import init_engine

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["DELETE", "GET", "POST", "PUT"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_engine()
    print("Starting up...")

@app.on_event("shutdown")
async def shutdown():
    print("Shutting down...")

app.include_router(ping.router)
app.include_router(main.router)