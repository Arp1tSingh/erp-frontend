// src/App.tsx

import { useState } from "react";
// 1. Add imports for the router and the HomePage component
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomePage }  from "./components/HomePage";
import { StudentDashboard } from "./components/StudentDashboard";
import { AdminDashboard } from "./components/AdminDashboard";

export default function App() {
  // 2. Keep only ONE copy of your state and handler functions
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "admin" | null>(null);
  const navigate = useNavigate();

  const handleLogin = (role: "student" | "admin") => {
    setUserRole(role);
    setIsLoggedIn(true);
    if (role === "student") {
      navigate("/student/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  // 3. Remove the old 'if (isLoggedIn)' checks. The router handles this now.

  // 4. The return statement should only contain the router JSX.
  return (
    <Routes>
      <Route path="/" element={<HomePage onLogin={handleLogin} />} />
      <Route path="/student/dashboard" element={<StudentDashboard onLogout={handleLogout} />} />
      <Route path="/admin/dashboard" element={<AdminDashboard onLogout={handleLogout} />} />
    </Routes>
  );
}