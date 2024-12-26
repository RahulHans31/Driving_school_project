import mysql.connector
from mysql.connector import Error
from faker import Faker
from datetime import datetime

# Initialize Faker instance
fake = Faker()

def get_db_connection():
    """Establish a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host="localhost",     # Your MySQL host
            user="root",          # Your MySQL username
            password="Rh@310803",  # Your MySQL password
            database="driving_school"  # Your database name
        )
        return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def generate_student_data():
    """
    Generate random student data for insertion into the 'students' table.
    """
    name = fake.name()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=82)
    prior_experience = fake.random_int(min=0, max=5)
    first_vehicle = fake.random_element(["Car", "Bike", "Truck"])
    practice_hours = fake.random_int(min=0, max=200)
    driving_lessons = fake.random_int(min=0, max=100)
    written_test_score = fake.random_int(min=0, max=100)
    confidence_level = fake.random_int(min=0, max=10)

    return (name, dob, prior_experience, first_vehicle, practice_hours, driving_lessons, written_test_score, confidence_level)

def insert_student_data(num_students=10000):
    """Insert a large number of student data into the database."""
    try:
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()

            # Create a list to store student data
            students_to_insert = []

            for _ in range(num_students):
                student_data = generate_student_data()
                students_to_insert.append(student_data)

                # Insert data in batches of 1000 for performance
                if len(students_to_insert) == 1000:
                    cursor.executemany("""
                        INSERT INTO students (name, dob, prior_experience, first_vehicle, practice_hours, driving_lessons, written_test_score, confidence_level)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, students_to_insert)
                    connection.commit()
                    students_to_insert = []  # Reset the list for the next batch

            # Insert any remaining data that didn't fill a full batch
            if students_to_insert:
                cursor.executemany("""
                    INSERT INTO students (name, dob, prior_experience, first_vehicle, practice_hours, driving_lessons, written_test_score, confidence_level)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, students_to_insert)
                connection.commit()

            print(f"{num_students} students inserted successfully!")
            cursor.close()
            connection.close()
    except Error as e:
        print(f"Error inserting student data: {e}")

def insert_test_results():
    """Insert test results data into the database for each student."""
    try:
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute("SELECT id FROM students")
            student_ids = cursor.fetchall()

            # Create a list to store test result data
            test_results_to_insert = []

            for student_id in student_ids:
                actual_result = fake.boolean()
                predicted_result = fake.boolean()

                test_results_to_insert.append((student_id[0], actual_result, predicted_result))

                # Insert data in batches of 1000 for performance
                if len(test_results_to_insert) == 1000:
                    cursor.executemany("""
                        INSERT INTO test_results (student_id, actual_result, predicted_result)
                        VALUES (%s, %s, %s)
                    """, test_results_to_insert)
                    connection.commit()
                    test_results_to_insert = []  # Reset the list for the next batch

            # Insert any remaining data that didn't fill a full batch
            if test_results_to_insert:
                cursor.executemany("""
                    INSERT INTO test_results (student_id, actual_result, predicted_result)
                    VALUES (%s, %s, %s)
                """, test_results_to_insert)
                connection.commit()

            print("Test results inserted successfully!")
            cursor.close()
            connection.close()
    except Error as e:
        print(f"Error inserting test results: {e}")

def main():
    """Main function to insert student data and test results."""
    insert_student_data(num_students=10000)  # Insert 10,000 student data
    insert_test_results()   # Insert test results data

if __name__ == "__main__":
    main()
