import NotFound from './pages/NotFound';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import CreateCourse from './pages/CreateCourse';
import MyCourses from './pages/MyCourses';
import EnrolledCourses from './pages/EnrolledCourses';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import CourseUpload from './pages/CourseUpload';
import InstructorDashboard from './pages/InstructorDashboard';
import LessonPage from './pages/LessonPage';
import StudentDashboard from './pages/StudentDashboard';
import QuizPage from './pages/QuizPage';
import CommentsPage from './pages/CommentsPage';
import LiveClassesPage from './pages/LiveClassesPage';
import ProgressPage from './pages/ProgressPage';
import NotificationsPage from './pages/NotificationsPage';
import DiscussionForum from './pages/DiscussionForum';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import About from './pages/About';
import Terms from './pages/Terms';
import Help from './pages/Help';
import ScrollToTop from './components/ScrollToTop';
import EnrollmentPage from './pages/EnrollmentPage';
import VerifyOTP from './pages/VerifyOTP';
import PrivateRoute from './components/PrivateRoute';
import CartPage from './pages/CartPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="dashboard/student/my-courses" element={<MyCourses />} />
        <Route path="/dashboard/student/enrolled-courses" element={<EnrolledCourses />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload-course" element={<CourseUpload />} />
        <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
        <Route path="/dashboard/student/lesson" element={<LessonPage />} />
        <Route path="/dashboard/student" element={<PrivateRoute> <StudentDashboard /> </PrivateRoute>} />
        <Route path="/dashboard/student/quiz" element={<QuizPage />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/dashboard/student/live" element={<LiveClassesPage />} />
        <Route path="/live-classes" element={<LiveClassesPage />} />
        <Route path="/dashboard/student/progress" element={<ProgressPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/discussion" element={<DiscussionForum />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        <Route path="/enroll" element={<EnrollmentPage />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFound />} />   
    
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
