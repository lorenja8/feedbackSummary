import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotAllowed from "./pages/NotAllowed";
import SessionDetail from "./pages/SessionDetail";

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/session/:sessionId"
        element={
          <ProtectedRoute role="student">
            <SessionDetail />
          </ProtectedRoute>
        }
      />

      <Route path="/403" element={<NotAllowed />} />

    </Routes>
  );
}
