import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';  // Import useLocation for query params

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { studentId } = useParams();  // Get studentId from the URL params (if available)
  const location = useLocation();  // Use useLocation to get the current location and its query parameters

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        let url = 'https://driving-school-project.onrender.com/students/';

        // Check if studentId is available from URL params or query string
        if (studentId) {
          url += `?student_id=${studentId}`;  // Add student_id as query parameter
        }

        const response = await axios.get(url);  // Fetch student data from the server
        setStudents(response.data);  // Wrap the specific student in an array if found
      } catch (error) {
        // Handling different types of errors
        if (error.response) {
          setError(`Error: ${error.response.status} - ${error.response.data.message || 'Unable to fetch students'}`);
        } else if (error.request) {
          setError('Error: No response from the server. Please check your connection.');
        } else {
          setError('Error: Something went wrong. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();  // Call the function to fetch students
  }, [studentId, location.search]);  // Re-run effect if studentId or search params change

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>{studentId ? 'Student Details' : 'Student List'}</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Date of Birth</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Prior Experience</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>First Vehicle</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Practice Hours</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Driving Lessons</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Written Test Score</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Confidence Level</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={{ padding: '8px' }}>{student.name}</td>
                <td style={{ padding: '8px' }}>{student.dob}</td>
                <td style={{ padding: '8px' }}>{student.prior_experience ? 'Yes' : 'No'}</td>
                <td style={{ padding: '8px' }}>{student.first_vehicle}</td>
                <td style={{ padding: '8px' }}>{student.practice_hours}</td>
                <td style={{ padding: '8px' }}>{student.driving_lessons}</td>
                <td style={{ padding: '8px' }}>{student.written_test_score}</td>
                <td style={{ padding: '8px' }}>{student.confidence_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;
