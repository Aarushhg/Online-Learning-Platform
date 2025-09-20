# 📚 LearnPro

A full-stack Learning Management System (LMS) built with MERN (MongoDB, Express, React, Node.js).  
It provides separate dashboards for students, instructors, and admins, enabling a smooth online learning experience with courses, lessons, live classes, quizzes, and more.

---

## ✨ Features

### 👩‍🎓 Student
- Browse & enroll in courses
- Watch YouTube lessons inside the platform
- Join live Zoom/Meet classes
- Receive course notifications
- Track progress & attempt quizzes
- Participate in discussion forums

### 👨‍🏫 Instructor
- Create and manage courses
- Add lessons (YouTube URLs)
- Schedule live classes (Zoom/Meet links)
- Send course notifications
- Create quizzes for assessments

### 👨‍💻 Admin
- Manage users and courses
- Update or delete courses and users
- View course details (lessons, live classes, notifications)
- Dashboard with search, filter & pagination

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- CSS (Custom + Dark Mode Support)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose

### Authentication
- JWT (JSON Web Tokens)

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
    ```bash
    git clone https://github.com/your-username/online-learning-platform.git
    cd e-learning-platform

### 2️⃣ Backend Setup 
    cd backend
    npm install


    Create a .env file in the backend/ directory:

    MONGO_URI=mongodb://localhost:27017/Learnpro
    JWT_SECRET=your_jwt_secret


    Run backend:

    npm start

### 3️⃣ Frontend Setup
    cd frontend
    npm install
    npm start


    Frontend runs on http://localhost:3000

    Backend runs on http://localhost:5000
