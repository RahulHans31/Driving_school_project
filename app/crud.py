from sqlalchemy.orm import Session
from . import models, schemas

# Add a new student
def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# Get all students
def get_students(db: Session):
    return db.query(models.Student).all()

# Add a new test result
def create_test_result(db: Session, result: schemas.TestResultBase):
    db_result = models.TestResult(**result.dict())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result
