from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class StudentBase(BaseModel):
    name: str
    dob: date
    prior_experience: bool
    first_vehicle: Optional[str] = None
    practice_hours: Optional[int] = None
    driving_lessons: Optional[int] = None
    written_test_score: Optional[int] = None
    confidence_level: Optional[int] = None

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int
    submission_date: datetime

    class Config:
        orm_mode = True

class TestResultBase(BaseModel):
    student_id: int
    actual_result: Optional[bool] = None
    predicted_result: Optional[bool] = None

class TestResultResponse(TestResultBase):
    id: int
    result_date: datetime

    class Config:
        orm_mode = True
