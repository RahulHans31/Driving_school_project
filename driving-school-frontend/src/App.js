import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Importing the App.css for styling
import HomePage from './components/HomePage'; // Adjust the import path
import StudentForm from './components/StudentForm'; // Form to add new students
import PredictionForm from './components/PredictionForm'; // Form to make predictions
import StudentList from './components/StudentList'; // List of all students
import StudentDetail from './components/StudentDetail'; // Specific student details page


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/prediction-form" element={<PredictionForm />} />
        <Route path="/student-list" element={<StudentList />} />
        <Route path="/student/:studentId" element={<StudentList />} /> {/* Dynamic student page */}
      </Routes>
    </Router>
  );
}

export default App;
