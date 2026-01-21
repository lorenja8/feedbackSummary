import enum
from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from db.base import Base
from sqlalchemy.orm import relationship

# possible later implementation of UUID; a little more confusing but secure; implementation below
# as PK: Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
# as FK: Column(UUID(as_uuid=True), ForeignKey("courses.course_id"))
# import uuid
# from sqlalchemy.dialects.postgresql import UUID


class RoleEnum(enum.Enum):
    admin = "admin"
    student = "student"
    teacher = "teacher"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course_teacher = relationship("CourseTeacher", back_populates="teacher")
    course_student = relationship("CourseStudent", back_populates="student")
    feedback_entry_teacher = relationship(
        "FeedbackEntry",
        back_populates="teacher",
        foreign_keys="FeedbackEntry.reviewed_teacher_id"
    )
    feedback_entry_student = relationship(
        "FeedbackEntry",
        back_populates="student",
        foreign_keys="FeedbackEntry.reviewing_student_id"
    )
    analysis_result = relationship("AnalysisResult", back_populates="teacher")


class CourseTeacher(Base):
    __tablename__ = "courses_teachers"

    course_id = Column(Integer, ForeignKey("courses.course_id"), primary_key=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    teacher = relationship("User", back_populates="course_teacher")
    course = relationship("Course", back_populates="course_teacher")


class CourseStudent(Base):
    __tablename__ = "courses_students"

    course_id = Column(Integer, ForeignKey("courses.course_id"), primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    student = relationship("User", back_populates="course_student")
    course = relationship("Course", back_populates="course_student")


class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True)
    course_name = Column(String, nullable=False)

    course_teacher = relationship("CourseTeacher", back_populates="course")
    course_student = relationship("CourseStudent", back_populates="course")
    feedback_entry = relationship("FeedbackEntry", back_populates="course")


class FeedbackEntry(Base):
    __tablename__ = "feedback_entries"

    feedback_id = Column(Integer, primary_key=True)
    reviewed_teacher_id = Column(Integer, ForeignKey("users.id"))
    reviewing_student_id = Column(Integer, ForeignKey("users.id"))
    reviewed_course_id = Column(Integer, ForeignKey("courses.course_id"))
    session_id = Column(Integer, ForeignKey("feedback_sessions.session_id"))
    feedback_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    teacher = relationship("User", back_populates="feedback_entry_teacher", foreign_keys=[reviewed_teacher_id])
    student = relationship("User", back_populates="feedback_entry_student", foreign_keys=[reviewing_student_id])
    course = relationship("Course", back_populates="feedback_entry", foreign_keys=[reviewed_course_id])
    feedback_session = relationship("FeedbackSession", back_populates="feedback_entry")


class FeedbackSession(Base):
    __tablename__ = "feedback_sessions"

    session_id = Column(Integer, primary_key=True)
    session_name = Column(String, nullable=False)
    questions_json = Column(JSONB, nullable=True)
    starts_at = Column(DateTime(timezone=True))
    closes_at = Column(DateTime(timezone=True))

    feedback_entry = relationship("FeedbackEntry", back_populates="feedback_session")
    analysis_result = relationship("AnalysisResult", back_populates="feedback_session")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    analysis_id = Column(Integer, primary_key=True)
    reviewed_teacher_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(Integer, ForeignKey("feedback_sessions.session_id"))
    llm_results_json = Column(JSONB, nullable=True)     # llm_results_json = Column(String, nullable=True)
    other_results_json = Column(JSONB, nullable=True)   # other_results_json = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    teacher = relationship("User", back_populates="analysis_result")
    feedback_session = relationship("FeedbackSession", back_populates="analysis_result")
