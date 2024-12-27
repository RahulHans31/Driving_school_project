# Driving School Project

## Description
The Driving School Project is a web application designed to manage driving school operations, including student registrations, lesson scheduling, and performance tracking. It provides a user-friendly interface for both students and instructors to interact with the system.

## Technologies Used
- **Frontend**: React
- **Backend**: FastAPI
- **Database**: MySQL

## Features
- Student registration and management
- Lesson scheduling and tracking
- Performance evaluation and feedback
- Responsive design for mobile and desktop users

## Flow of the Application
1. **User Registration**: Students can register through the frontend, which sends data to the FastAPI backend.
2. **Data Storage**: The backend processes the registration and stores the information in a MySQL database.
3. **Lesson Scheduling**: Users can schedule lessons, which are managed by the backend and stored in the database.
4. **Performance Tracking**: Instructors can provide feedback on student performance, which is also stored in the database and accessible through the frontend.

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/driving-school-project.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd driving-school-project/app
   ```
3. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Navigate to the frontend directory:
   ```bash
   cd ../driving-school-frontend
   ```
5. Install the frontend dependencies:
   ```bash
   npm install
   ```

## Usage
To run the application, follow these steps:

1. Start the FastAPI backend:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

2. Start the React frontend:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`.

3. Open your browser and navigate to the frontend URL to access the application.

## Live Demo
You can view the live demo of the application at [Driving School Project](https://driving-school-project.vercel.app/).

## License
This project is licensed under the MIT License.
