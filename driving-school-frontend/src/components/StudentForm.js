import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const StudentForm = () => {
  // State to hold input values
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [priorExperience, setPriorExperience] = useState(false);
  const [firstVehicle, setFirstVehicle] = useState('');
  const [practiceHours, setPracticeHours] = useState('');
  const [drivingLessons, setDrivingLessons] = useState('');
  const [writtenTestScore, setWrittenTestScore] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('');
  const [testTaken, setTestTaken] = useState(false); // State for test taken
  const [testResult, setTestResult] = useState(''); // State for test result (Pass/Fail)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // useNavigate hook for redirection
  const navigate = useNavigate();

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state

    const studentDetails = {
      name,
      dob,
      prior_experience: priorExperience,
      first_vehicle: firstVehicle,
      practice_hours: practiceHours,
      driving_lessons: drivingLessons,
      written_test_score: writtenTestScore,
      confidence_level: confidenceLevel,
    };

    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams({
        test_taken: testTaken,
        test_result: testResult || '', // If not provided, leave empty
      }).toString();

      // Send POST request with query parameters and student data
      const response = await axios.post(
        `https://driving-school-project.onrender.com/students/?${queryParams}`,
        studentDetails,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      // If successful, show a success popup
      const userChoice = window.confirm('Student added successfully! Do you want to go back to the homepage?');
      if (userChoice) {
        navigate('/'); // Redirect to homepage if OK is clicked
      } else {
        // Do nothing if Cancel is clicked, popup will disappear
      }
    } catch (error) {
      setError('Failed to add student. Please try again later.');
      window.alert('There was an error adding the student.'); // Show an error alert if request fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add New Student</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prior Experience:</label>
          <input
            type="checkbox"
            checked={priorExperience}
            onChange={() => setPriorExperience(!priorExperience)}
          />
        </div>
        <div>
          <label>First Vehicle:</label>
          <input
            type="text"
            value={firstVehicle}
            onChange={(e) => setFirstVehicle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Practice Hours:</label>
          <input
            type="number"
            value={practiceHours}
            onChange={(e) => setPracticeHours(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Driving Lessons:</label>
          <input
            type="number"
            value={drivingLessons}
            onChange={(e) => setDrivingLessons(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Written Test Score:</label>
          <input
            type="number"
            value={writtenTestScore}
            onChange={(e) => setWrittenTestScore(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confidence Level:</label>
          <input
            type="number"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Has the student taken the test?</label>
          <input
            type="checkbox"
            checked={testTaken}
            onChange={() => setTestTaken(!testTaken)}
          />
        </div>

        {testTaken && ( // Only show test result if testTaken is true
          <div>
            <label>Test Result:</label>
            <select
              value={testResult}
              onChange={(e) => setTestResult(e.target.value)}
              required
            >
              <option value="">Select Pass/Fail</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
        )}

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
