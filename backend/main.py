from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, projects
import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Darukaa.Earth API",
    description="Backend API for darukaa earth project",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["Authentication"])
app.include_router(projects.router, tags=["Projects and Sites"])

@app.get("/", tags=["Health"])
def root():
    return {"message": "Welcome to Darukaa.Earth API. Everything is running smoothly!"}