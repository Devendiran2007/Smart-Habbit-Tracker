from fastapi import APIRouter , Depends , HTTPException
from sqlalchemy.orm import Session
from .. import schemas , database , models
from .. auth import get_current_user
from datetime import timedelta, date

router = APIRouter()

@router.post("/{habbit_id}")
def complete_habit(habbit_id: int,current_user: models.User = Depends(get_current_user),db: Session = Depends(database.get_db)):
    habit = db.query(models.Habbit).filter(
        models.Habbit.id == habbit_id,
        models.Habbit.owner_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    today = date.today()

    already_completed = db.query(models.HabbitCompletion).filter(
        models.HabbitCompletion.habbit_id == habbit_id,
        models.HabbitCompletion.date_completed == today
    ).first()

    if already_completed:
        raise HTTPException(status_code=400, detail="Already completed today")

    completion = models.HabbitCompletion(
        habbit_id=habbit_id,
        date_completed=today
    )

    db.add(completion)
    db.commit()

    return {"message": "Completed"}

@router.delete("/{habbit_id}")
def uncomplete_habit(habbit_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    habit = db.query(models.Habbit).filter(
        models.Habbit.id == habbit_id,
        models.Habbit.owner_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    today = date.today()

    completion = db.query(models.HabbitCompletion).filter(
        models.HabbitCompletion.habbit_id == habbit_id,
        models.HabbitCompletion.date_completed == today
    ).first()

    if not completion:
        raise HTTPException(status_code=404, detail="No completion found for today")

    db.delete(completion)
    db.commit()

    return {"message": "Completion removed"}

@router.get("/{habbit_id}/today")
def check_completed_today(habbit_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    habit = db.query(models.Habbit).filter(
        models.Habbit.id == habbit_id,
        models.Habbit.owner_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    today = date.today()

    completion = db.query(models.HabbitCompletion).filter(
        models.HabbitCompletion.habbit_id == habbit_id,
        models.HabbitCompletion.date_completed == today
    ).first()

    return {"completed_today": completion is not None}


def calculate_streak(dates):
    if not dates:
        return 0
    
    dates = sorted(dates)
    
    streak = 0
    today = date.today()

    for i, d in enumerate(dates):
        if d == today - timedelta(days=i):
            streak += 1
        else:
            break

    return streak

def calculate_longest_streak(dates):
    if not dates:
        return 0

    dates = sorted(dates)
    longest = 1
    current = 1

    for i in range(1, len(dates)):
        if dates[i] == dates[i-1] + timedelta(days=1):
            current += 1
            longest = max(longest, current)
        else:
            current = 1

    return longest

def calculate_30_day_rate(dates):
    today = date.today()
    last_30_days = [today - timedelta(days=i) for i in range(30)]

    completed_days = sum(1 for d in last_30_days if d in dates)

    return round((completed_days / 30) * 100)

@router.get("/{habbit_id}/streak")
def get_streak(habbit_id: int,current_user: models.User = Depends(get_current_user),db: Session = Depends(database.get_db)):
    habit = db.query(models.Habbit).filter(
        models.Habbit.id == habbit_id,
        models.Habbit.owner_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    completions = db.query(models.HabbitCompletion).filter(
        models.HabbitCompletion.habbit_id == habbit_id
    ).all()

    completion_dates = [c.date_completed for c in completions]
    streak = calculate_streak(completion_dates)
    return {"streak": streak}

@router.get("/{habbit_id}/stats")
def get_habit_stats(
    habbit_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    habit = db.query(models.Habbit).filter(
        models.Habbit.id == habbit_id,
        models.Habbit.owner_id == current_user.id
    ).first()

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    completion_dates = [c.date_completed for c in habit.completions]

    current_streak = calculate_streak(completion_dates)
    longest_streak = calculate_longest_streak(completion_dates)
    total_completions = len(completion_dates)
    rate_30_days = calculate_30_day_rate(completion_dates)

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "total_completions": total_completions,
        "completion_rate_last_30_days": rate_30_days
    }



