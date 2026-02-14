from fastapi import FastAPI
from .database import engine
from . import models
from .routers import users

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["Users"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Habbit Tracker API"}