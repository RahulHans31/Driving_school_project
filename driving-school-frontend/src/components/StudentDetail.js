import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentDetail = () => {
  const { student_id } = useParams(); // Get student ID from the URL parameters
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // Send GET request with query parameter
        const response = await axios.get(`https://driving-school-project.onrender.com/students/`, {
          params: { student_id: student_id }  // Pass student_id as query param
        });
        setStudent(response.data);  // Assuming the response is a single student object
      } catch (error) {
        setError('Error fetching student details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [student_id]);  // Trigger re-fetch when student_id changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!student) {
    return <div>No student found with the given ID.</div>;
  }

  return (
    <div>
      <h2>Student Details</h2>
      <div>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Date of Birth:</strong> {student.dob}</p>
        <p><strong>Prior Experience:</strong> {student.prior_experience ? 'Yes' : 'No'}</p>
        <p><strong>First Vehicle:</strong> {student.first_vehicle}</p>
        <p><strong>Practice Hours:</strong> {student.practice_hours}</p>
        <p><strong>Driving Lessons:</strong> {student.driving_lessons}</p>
        <p><strong>Written Test Score:</strong> {student.written_test_score}</p>
        <p><strong>Confidence Level:</strong> {student.confidence_level}</p>
      </div>
    </div>
  );
};

export default StudentDetail;
