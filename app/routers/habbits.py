from sys import prefix
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, database, models
from ..auth import get_current_user

router = APIRouter()

@router.post("/create", response_model = schemas.HabbitResponse)
def create_habbit(habbit: schemas.HabbitCreate , db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user) ):
    db_habbit = models.Habbit(
        title = habbit.title,
        description = habbit.description,
        owner_id = current_user.id
    )
    db.add(db_habbit)    
    db.commit()
    db.refresh(db_habbit)
    return db_habbit

@router.get("/habbits" , response_model = list[schemas.HabbitResponse])
def get_habbits(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    habbits = db.query(models.Habbit).filter(models.Habbit.owner_id == current_user.id).all()
    return habbits

@router.get("/habbits/{habbit_id}" , response_model = schemas.HabbitResponse)
def get_habbit(habbit_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    habbit = db.query(models.Habbit).filter(models.Habbit.id == habbit_id).first()
    if not habbit:
        raise HTTPException(status_code=404, detail="Habbit not found")
    return habbit

@router.delete("/habbits/{habbit_id}" , response_model = schemas.HabbitResponse)
def delete_habbit(habbit_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    habbit = db.query(models.Habbit).filter(models.Habbit.id == habbit_id).first()
    if not habbit:
        raise HTTPException(status_code=404, detail="Habbit not found")
    db.delete(habbit)
    db.commit()
    return habbit

@router.put("/habbits/{habbit_id}" , response_model = schemas.HabbitResponse)
def update_habbit(habbit_id: int, habbit: schemas.HabbitCreate , db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    db_habbit = db.query(models.Habbit).filter(models.Habbit.id == habbit_id).first()
    if not db_habbit:
        raise HTTPException(status_code=404, detail="Habbit not found")
    db_habbit.title = habbit.title
    db_habbit.description = habbit.description
    db.commit()
    db.refresh(db_habbit)
    return db_habbit





