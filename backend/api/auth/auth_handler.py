from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from api.deps import get_db
from db.tables import User
from datetime import datetime, timedelta, timezone


from typing import Annotated


router = APIRouter(tags=["authentication-and-authorization"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "123456789abcdefghijklmnopqrstuvwxyz"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


class Token(BaseModel):
    access_token: str
    token_type: str


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False

    return user


def create_access_token(uid: str, role: str, expires_delta: timedelta):
    expires = datetime.now(timezone.utc) + expires_delta
    encode = {"sub": uid, "role": role, "exp": expires}
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid: str = payload.get("sub")
        role: str = payload.get("role")
        if uid is None or role is None:
            raise HTTPException(status_code=401, detail="Could not validate user.")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate user.")
    return {"uid": uid, "role": role}


def require_role(*allowed_roles):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions."
            )
        return current_user
    return role_checker


@router.post("/auth/login")
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    username = form_data.username
    password = form_data.password
    user = authenticate_user(db, username, password)

    if not user:
        raise HTTPException(status_code=401, detail="User verification unsuccessful.")

    # RoleEnum.value to get a string object
    token = create_access_token(str(user.id), user.role.value, timedelta(minutes=60))

    return {"access_token": token, "token_type": "bearer"}
