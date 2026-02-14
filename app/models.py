from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    habbits = relationship("Habbit", back_populates="owner", cascade="all, delete-orphan")

class Habbit(Base):
    __tablename__ = "habbits"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="habbits")
    completions = relationship("HabbitCompletion", back_populates="habbit", cascade="all, delete-orphan")

class HabbitCompletion(Base):
    __tablename__ = "habbit_completions"

    id = Column(Integer, primary_key=True, index=True)
    habbit_id = Column(Integer, ForeignKey("habbits.id"), nullable=False)
    date_completed = Column(Date, nullable=False)

    habbit = relationship("Habbit", back_populates="completions")