import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterVerify from './pages/RegisterVerify';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordVerify from './pages/ForgotPasswordVerify';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/ProductDetail';
import EditProduct from './pages/EditProduct';
import Toast from './components/Toast';
import RegisteredSuccess from './pages/RegisteredSuccess';
import { useEffect, useState } from "react";

// 🔒 ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) return null; // Prevent premature render

  return isAuth ? children : <Navigate to="/" replace />;
};


function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-verify" element={<RegisterVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-verify" element={<ForgotPasswordVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/registered-success" element={<RegisteredSuccess />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id/edit"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
