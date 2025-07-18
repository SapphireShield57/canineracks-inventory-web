import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://canineracks-backend.onrender.com/api/user/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/register-verify", { state: { email, password } });
      } else {
        if (data.email) {
          setError(`Email: ${data.email.join(" ")}`);
        } else if (data.password) {
          setError(`Password: ${data.password.join(" ")}`);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ fontFamily: "Futura, sans-serif", background: "linear-gradient(to right, #bbb, #eee)" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mx-4">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          CanineRacks <span className="text-red-600">🐾</span>
        </h1>
        <form className="space-y-4" onSubmit={handleRegister}>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg bg-gray-200"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold"
            style={{ backgroundColor: "#39d5e3", color: "black" }}
          >
            Register
          </button>
          <Link to="/">
            <button
              type="button"
              className="w-full mt-2 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "#555", color: "white" }}
            >
              Back to Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
