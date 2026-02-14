from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    habbits = relationship("Habbit", back_populates="owner")


class Habbit(Base):
    __tablename__ = "habbits"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="habbits")
    completions = relationship("HabbitCompletion", back_populates="habbit")


class HabbitCompletion(Base):
    __tablename__ = "habbit_completions"

    id = Column(Integer, primary_key=True, index=True)
    habbit_id = Column(Integer, ForeignKey("habbits.id"))
    date = Column(Date)

    habbit = relationship("Habbit", back_populates="completions")