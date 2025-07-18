import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("https://canineracks-backend.onrender.com/api/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      console.log("🧾 Full login response data:", data); // ADD THIS
      console.log("✅ Status OK?", response.ok); // ADD THIS
  
      if (!response.ok) {
        setError(data.detail || "Login failed. Please try again.");
        return;
      }
  
      if (data.access && data.refresh && data.user) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("userRole", data.user.role);
  
        console.log("✅ Tokens stored:", data.access); // ADD THIS
  
        if (data.user.role === "inventory_manager") {
          navigate("/dashboard");
        } else {
          navigate("/not-allowed");
        }
      } else {
        setError("Invalid login response format.");
        console.warn("🚫 Missing token fields in response:", data);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };
  

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{
        fontFamily: "Futura, sans-serif",
        background: "linear-gradient(to right, #bbb, #eee)",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mx-4">
        <h1 className="text-black text-3xl font-bold mb-6 text-center">
          CanineRacks <span className="text-[#5a2a1e]">🐾</span>
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-300 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-300 text-black"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold"
            style={{ backgroundColor: "#68e6f3", color: "black" }}
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-black font-medium">
          <Link to="/forgot-password" className="hover:underline">
            Forgot Password
          </Link>
          <Link to="/register" className="hover:underline">
            Don’t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}
