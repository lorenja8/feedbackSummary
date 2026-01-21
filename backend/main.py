from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth import auth_handler
from api.routers import (
    users,
    courses,
    courses_students,
    courses_teachers,
    feedback_sessions,
    feedback_entries,
    tools)
from db.init_db import init_db

@asynccontextmanager
async def on_startup(application: FastAPI):
    init_db()
    yield

app = FastAPI(title="Feedback Summary API", version="1.0", lifespan=on_startup)

# Include routers
app.include_router(auth_handler.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(courses_students.router)
app.include_router(courses_teachers.router)
app.include_router(feedback_sessions.router)
app.include_router(feedback_entries.router)
app.include_router(tools.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # or ["http://frontend-container:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

@app.get("/health")
def health():
    return {"status": "ok"}
