from typing import Optional
from pydantic import BaseModel, ConfigDict
from enum import Enum


class RoleEnum(str, Enum):
    admin = "admin"
    student = "student"
    teacher = "teacher"


class UserBase(BaseModel):
    username: str
    name: str
    role: RoleEnum
    password_hash: str


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    role: Optional[RoleEnum] = None
    password_hash: Optional[str] = None
