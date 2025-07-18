import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !code) {
      setError("Missing reset data. Please try again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/user/reset-password/", {
        email,
        code,
        new_password: newPassword,
        purpose: "reset", // ✅ REQUIRED for backend
      });

      setSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ fontFamily: "Futura, sans-serif", background: "linear-gradient(to right, #bbb, #eee)" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mx-4">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">Enter New Password</h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">Password reset successful!</p>}

        <form className="space-y-4" onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Enter Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-300"
          />
          <input
            type="password"
            placeholder="Re enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold"
            style={{ backgroundColor: "#5ff0f4", color: "black" }}
          >
            {loading ? "Resetting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
