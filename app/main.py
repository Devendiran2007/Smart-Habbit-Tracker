from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import users, habbits , completions

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(habbits.router, prefix="/habbits", tags=["Habbits"])
app.include_router(completions.router, prefix="/completions", tags=["Completions"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Habbit Tracker API"}