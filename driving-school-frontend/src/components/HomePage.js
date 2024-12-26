import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [studentId, setStudentId] = useState('');

  const handleInputChange = (e) => {
    setStudentId(e.target.value);
  };

  return (
    <div>
      <h1>Welcome to the Driving School Portal</h1>

      <div>
        <label>Enter Student ID:</label>
        <input 
          type="number" 
          value={studentId} 
          onChange={handleInputChange} 
          placeholder="Student ID" 
        />
        <Link to={`/student/${studentId}`}>
          <button disabled={!studentId}>View Specific Student</button>
        </Link>
      </div>

      <div>
        <Link to="/student-form">
          <button>Add New Student</button>
        </Link>
      </div>

      <div>
        <Link to="/prediction-form">
          <button>Make Prediction</button>
        </Link>
      </div>

      <div>
        <Link to="/student-list">
          <button>View All Students</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage; // Default export for the HomePage component
