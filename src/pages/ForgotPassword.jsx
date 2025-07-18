import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/user/send-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "reset" }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Code sent to ${email}`);
        navigate("/forgot-password-verify", { state: { email } });
      } else {
        setError(data.error || "Failed to send code");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSendCode}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
        style={{ fontFamily: "Futura, sans-serif" }}
      >
        <h1 className="text-3xl font-bold text-center text-black">CanineRacks</h1>
        <h2 className="text-lg font-semibold text-center text-gray-700">Forgot Password</h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {message && <p className="text-green-600 text-sm text-center">{message}</p>}

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
        >
          {loading ? "Sending..." : "Send Code"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full border border-gray-400 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
