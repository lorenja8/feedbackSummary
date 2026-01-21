import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- use login from context

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      // login() already calls the backend AND stores token+role
      const res = await login(username, password); // <-- this is correct now
 
      // Redirect by role
      switch (res.role) {
        case "student":
          navigate("/student");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      setError("Invalid username or password");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-80 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <input
          className="border w-full p-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="border w-full p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
