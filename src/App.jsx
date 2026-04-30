import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Profile from './pages/Profile';
import Registration from './pages/Registration';
import Payment from './pages/Payment';
import Exam from './pages/Exam';
import StudentDashboard from './pages/StudentDashboard';
import AdminStats from './pages/AdminStats';
import AdminApplicants from './pages/AdminApplicants';
import AdminExams from './pages/AdminExams';
import AdminQuestions from './pages/AdminQuestions';
import AdminPayments from './pages/AdminPayments';

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
