import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  role,
  children,
}: {
    role: "student" | "teacher" | "admin";
    children: React.JSX.Element;
}) {
    const { token, role: userRole } = useAuth();

    if (!token) return <Navigate to="/login" />;
    if (userRole !== role) return <Navigate to="/403" />; //<Navigate to="/" />;

  return children;
}
