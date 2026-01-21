from sqlalchemy.orm import Session
from db.tables import User
from api.schemas.user import UserCreate, UserUpdate
from api.auth.auth_handler import hash_password


def create_user(db: Session, user: UserCreate):
    hashed = hash_password(user.password_hash)
    db_user = User(
        username=user.username,
        name=user.name,
        role=user.role,
        password_hash=hashed
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_users(db: Session, skip=0, limit=50):
    return db.query(User).offset(skip).limit(limit).all()


def delete_user(db: Session, user_id: int):
    obj = get_user(db, user_id)
    if not obj:
        return obj
    db.delete(obj)
    db.commit()
    return obj


def update_user(db: Session, user_id: int, updated_user: UserUpdate):
    obj = get_user(db, user_id)
    if not obj:
        return None
    if updated_user.username is not None:
        obj.login = updated_user.username
    if updated_user.role is not None:
        obj.role = updated_user.role
    if updated_user.name is not None:
        obj.name = updated_user.name
    if updated_user.password_hash is not None:
        hashed = hash_password(updated_user.password_hash)
        obj.password_hash = hashed
    db.commit()
    db.refresh(obj)
    return obj
