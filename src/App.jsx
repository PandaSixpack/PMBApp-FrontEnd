import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Profile from './pages/student/Profile';
import Registration from './pages/student/Registration';
import Payment from './pages/student/Payment';
import Exam from './pages/student/Exam';
import StudentDashboard from './pages/student/Dashboard';
import AdminStats from './pages/admin/Dashboard';
import AdminApplicants from './pages/admin/Applicants';
import AdminExams from './pages/admin/Exams';
import AdminQuestions from './pages/admin/Questions';
import AdminPayments from './pages/admin/Payments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
          <Route path="/dashboard/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/dashboard/registration" element={<DashboardLayout><Registration /></DashboardLayout>} />
          <Route path="/dashboard/payment" element={<DashboardLayout><Payment /></DashboardLayout>} />
          <Route path="/dashboard/exam" element={<DashboardLayout><Exam /></DashboardLayout>} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<DashboardLayout><AdminStats /></DashboardLayout>} />
          <Route path="/admin/applicants" element={<DashboardLayout><AdminApplicants /></DashboardLayout>} />
          <Route path="/admin/exams" element={<DashboardLayout><AdminExams /></DashboardLayout>} />
          <Route path="/admin/questions" element={<DashboardLayout><AdminQuestions /></DashboardLayout>} />
          <Route path="/admin/payments" element={<DashboardLayout><AdminPayments /></DashboardLayout>} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
