from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, Base, get_db
import joblib
import numpy as np

from fastapi.middleware.cors import CORSMiddleware

# Load the trained model
model = joblib.load("driving_test_model.pkl")

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. For production, replace "*" with the specific frontend URL.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all headers.
)

# Endpoint to add a student
@app.post("/students/", response_model=schemas.StudentResponse)
def add_student(student: schemas.StudentCreate, test_taken: bool, test_result: str = None, db: Session = Depends(get_db)):
    # Create the student in the database
    db_student = crud.create_student(db, student)

    if test_taken:
        if test_result in ['Pass', 'Fail']:
            # If test was given and result is provided, update the test result
            test_result_data = schemas.TestResultBase(
                student_id=db_student.id,
                actual_result=True if test_result == "Pass" else False
            )
            crud.create_test_result(db, test_result_data)
            message = "Test result updated successfully!"
        else:
            raise HTTPException(status_code=400, detail="Invalid test result value. It should be 'Pass' or 'Fail'.")
    else:
        # No test was given, proceed with prediction
        features = np.array([
            student.prior_experience,
            student.practice_hours,
            student.driving_lessons,
            student.written_test_score,
            student.confidence_level
        ]).reshape(1, -1)
        
        # Predict using the loaded model
        prediction = model.predict(features)
        predicted_result = True if prediction[0] == 1 else False
        
        # Create and store the test result
        test_result_data = schemas.TestResultBase(
            student_id=db_student.id,
            predicted_result=predicted_result
        )
        crud.create_test_result(db, test_result_data)
        message = f"Prediction stored successfully! Student is expected to: {predicted_result}"
    
    # Serialize and return the student as a StudentResponse object
    return schemas.StudentResponse(
        id=db_student.id,
        name=db_student.name,
        dob=db_student.dob,
        prior_experience=db_student.prior_experience,
        first_vehicle=db_student.first_vehicle,
        practice_hours=db_student.practice_hours,
        driving_lessons=db_student.driving_lessons,
        written_test_score=db_student.written_test_score,
        confidence_level=db_student.confidence_level,
        submission_date=db_student.submission_date,
    )


@app.get("/students/", response_model=list[schemas.StudentResponse])
def read_students(student_id: int = None, db: Session = Depends(get_db)):
    if student_id:
        # Fetch a specific student by ID
        student = db.query(models.Student).filter(models.Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return [student]  # Return a list with one student
    else:
        # Fetch all students
        return crud.get_students(db)


# Endpoint to add a test result
@app.post("/test-results/", response_model=schemas.TestResultResponse)
def add_test_result(result: schemas.TestResultBase, db: Session = Depends(get_db)):
    return crud.create_test_result(db, result)

# Endpoint to predict if a student will pass the test
@app.post("/predict/")
def predict(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    # Prepare the feature array for prediction (excluding age and vehicle type)
    features = np.array([
        student.prior_experience,
        student.practice_hours,
        student.driving_lessons,
        student.written_test_score,
        student.confidence_level
    ]).reshape(1, -1)
    
    # Ensure all features are provided (handle missing values)
    if any(f is None for f in features[0]):
        raise HTTPException(status_code=400, detail="Missing required feature values.")
    
    # Make prediction using the loaded model
    prediction = model.predict(features)
    
    # Return the result (pass or fail)
    return {"prediction": "Pass" if prediction[0] == 1 else "Fail"}
