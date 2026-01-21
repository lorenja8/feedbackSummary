from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from api.schemas.user import UserCreate, UserRead, UserUpdate
from api.crud.user import (
    create_user,
    get_user,
    get_users,
    get_user_by_username,
    delete_user, update_user)
# from api.auth.auth_handler import require_role

router = APIRouter(prefix="/users",
                   tags=["users"])


@router.post("/", response_model=UserRead)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered.")
    return create_user(db, user)


@router.get("/by-username/{username}", response_model=UserRead)
def read_user_by_username(username: str, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    return db_user


@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    return db_user


@router.get("/", response_model=list[UserRead])
def read_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return get_users(db, skip, limit)


@router.delete("/{user_id}")
def delete(user_id: int, db: Session = Depends(get_db)):
    ok = delete_user(db, user_id)
    if not ok:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"status": "deleted"}


@router.put("/{user_id}", response_model=UserRead)
def update_user_endpoint(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    existing = get_user(db, user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found.")
    return update_user(db, user_id, user)
