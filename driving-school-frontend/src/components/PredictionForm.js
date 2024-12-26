import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [studentData, setStudentData] = useState({
    name: '',
    dob: '',
    prior_experience: false,
    first_vehicle: '',
    practice_hours: 0,
    driving_lessons: 0,
    written_test_score: 0,
    confidence_level: 0,
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check to ensure all fields are filled out correctly
    if (
      studentData.name.trim() === '' ||
      studentData.dob.trim() === '' ||
      studentData.first_vehicle.trim() === '' ||
      studentData.practice_hours <= 0 ||
      studentData.driving_lessons <= 0 ||
      studentData.written_test_score <= 0 ||
      studentData.confidence_level <= 0
    ) {
      alert('Please fill out all fields with valid values.');
      return;
    }

    setLoading(true); // Set loading state to true when the request starts

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict/', studentData);
      setLoading(false); // Set loading state to false when the response is received

      if (response.data.prediction) {
        setPrediction(response.data.prediction); // Set prediction result from response
      } else {
        alert('There was an issue with the prediction.');
        setPrediction(null); // Clear prediction on failure
      }
    } catch (error) {
      console.error('Error predicting test result:', error);
      setLoading(false); // Set loading state to false in case of error
      alert('There was an error while predicting the result. Please try again.');
    }
  };

  return (
    <div>
      <h2>Predict Driving Test Result</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={studentData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={studentData.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
          />
        </div>
        <div>
          <label>Prior Experience:</label>
          <input
            type="checkbox"
            name="prior_experience"
            checked={studentData.prior_experience}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>First Vehicle:</label>
          <input
            type="text"
            name="first_vehicle"
            value={studentData.first_vehicle}
            onChange={handleChange}
            placeholder="First Vehicle"
          />
        </div>
        <div>
          <label>Practice Hours:</label>
          <input
            type="number"
            name="practice_hours"
            value={studentData.practice_hours}
            onChange={handleChange}
            placeholder="Practice Hours"
          />
        </div>
        <div>
          <label>Driving Lessons:</label>
          <input
            type="number"
            name="driving_lessons"
            value={studentData.driving_lessons}
            onChange={handleChange}
            placeholder="Driving Lessons"
          />
        </div>
        <div>
          <label>Written Test Score:</label>
          <input
            type="number"
            name="written_test_score"
            value={studentData.written_test_score}
            onChange={handleChange}
            placeholder="Written Test Score"
          />
        </div>
        <div>
          <label>Confidence Level:</label>
          <input
            type="number"
            name="confidence_level"
            value={studentData.confidence_level}
            onChange={handleChange}
            placeholder="Confidence Level"
          />
        </div>
        <button type="submit" disabled={loading}>Predict</button>
      </form>

      {loading && <p>Loading...</p>} {/* Show loading message while waiting for response */}

      {prediction !== null && (
        <p>Prediction: {prediction}</p>
      )}
    </div>
  );
};

export default PredictionForm;
