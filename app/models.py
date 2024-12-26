from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from .database import Base

# Students table
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=False)
    prior_experience = Column(Boolean, nullable=False)
    first_vehicle = Column(String(50))
    practice_hours = Column(Integer)
    driving_lessons = Column(Integer)
    written_test_score = Column(Integer)
    confidence_level = Column(Integer)
    submission_date = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    test_results = relationship("TestResult", back_populates="student")

# Test Results table
class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    actual_result = Column(Boolean, nullable=True)
    predicted_result = Column(Boolean, nullable=True)
    result_date = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    student = relationship("Student", back_populates="test_results")
