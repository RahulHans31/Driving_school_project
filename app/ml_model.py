import mysql.connector
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score
import numpy as np
import joblib  # For saving the model

# MySQL connection details
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "Rh@310803",  # Replace with your MySQL password
    "database": "driving_school"
}

# Function to establish MySQL connection
def get_db_connection():
    return mysql.connector.connect(
        host=db_config["host"],
        user=db_config["user"],
        password=db_config["password"],
        database=db_config["database"]
    )

# Function to fetch data from MySQL
def fetch_data():
    connection = get_db_connection()
    
    # Fetching data: Student features and actual test results
    query = """
        SELECT s.prior_experience, s.practice_hours, s.driving_lessons, s.written_test_score, 
               s.confidence_level, t.actual_result
        FROM students s
        JOIN test_results t ON s.id = t.student_id
    """
    data = pd.read_sql(query, connection)
    
    # Close connection
    connection.close()
    
    return data

# Function to train the model
def train_model(data):
    # Preparing features (X) and labels (y)
    X = data[['prior_experience', 'practice_hours', 'driving_lessons', 'written_test_score', 'confidence_level']]
    y = data['actual_result']
    
    # Splitting data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train a logistic regression model
    model = LogisticRegression()
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    
    # Display the classification report (Precision, Recall, F1 Score)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Additional evaluation metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    
    # Save the model using joblib
    joblib.dump(model, 'driving_test_model.pkl')
    print("Model saved as 'driving_test_model.pkl'")
    
    return model

# Function to make predictions
def make_predictions(model):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    for student_id in range(1, 10001):  # Assuming we have 10,000 students
        # Fetch student data for prediction
        cursor.execute("""
            SELECT prior_experience, practice_hours, driving_lessons, written_test_score, confidence_level
            FROM students WHERE id = %s
        """, (student_id,))
        student_data = cursor.fetchone()
        
        # Prepare the features for prediction
        X_new = [student_data[0:5]]  # Extract features
        
        # Predict the result
        predicted_result = model.predict(X_new)[0]
        
        # Convert the prediction to boolean (True/False)
        predicted_result = bool(predicted_result)  # Convert to boolean (True/False)
        
        # Update the predicted result in the database
        cursor.execute("""
            UPDATE test_results
            SET predicted_result = %s
            WHERE student_id = %s
        """, (predicted_result, student_id))
        connection.commit()
    
    cursor.close()
    connection.close()

# Main function
def main():
    print("Fetching data from database...")
    data = fetch_data()
    
    print("Training the model...")
    model = train_model(data)
    
    print("Making predictions and updating the database...")
    make_predictions(model)
    
    print("Predictions have been made and stored in the database.")

if __name__ == "__main__":
    main()
