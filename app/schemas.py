from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

# User Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True

# Habit Schemas
class HabbitCreate(BaseModel):
    title: str
    description: Optional[str] = None

class HabbitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class HabbitResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    owner_id: int

    class Config:
        from_attributes = True

# Habit Completion Schemas
class HabbitCompletionCreate(BaseModel):
    date: date

class HabbitCompletionResponse(BaseModel):
    id: int
    habbit_id: int
    date: date

    class Config:
        from_attributes = True
