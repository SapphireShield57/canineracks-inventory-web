// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    console.log("🔐 Checking ProtectedRoute");
    console.log("🔐 accessToken in localStorage:", token);

    setIsAuthorized(!!token);
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) {
    console.log("⏳ Waiting for auth check...");
    return null; // You can replace this with a spinner if needed
  }

  if (!isAuthorized) {
    console.log("🚫 Not authorized, redirecting to login");
    return <Navigate to="/" replace />;
  }

  console.log("✅ Authorized, rendering protected content");
  return children;
};

export default ProtectedRoute;
