import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ForgotPasswordVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      setError("No email provided. Redirecting...");
      setTimeout(() => navigate("/forgot-password"), 2000);
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/user/verify-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, purpose: "reset" }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/reset-password", { state: { email, code } });
      } else {
        setError(data.error || "Invalid or expired code.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ fontFamily: "Futura, sans-serif", background: "linear-gradient(to right, #aaa, #eee)" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mx-4 text-center">
        <h1 className="text-black text-3xl font-bold mb-6">Verify</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {email && (
          <form className="space-y-4" onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter 5 Letter Code"
              maxLength={5}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="w-full p-3 bg-gray-400 rounded-lg text-center tracking-widest uppercase text-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "#68e6f3", color: "black" }}
            >
              {loading ? "Verifying..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "#333", color: "white" }}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordVerify;
