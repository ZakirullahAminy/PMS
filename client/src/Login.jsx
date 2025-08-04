import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Login failed");

      onLogin(data);
    } catch (err) {
      alert("Login error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-8 rounded-xl bg-white shadow-2xl w-96 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>

        <div className="space-y-4">
          <input
            className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="border border-gray-200 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-4 py-3 rounded-lg w-full hover:shadow-lg transition-all hover:from-blue-600 hover:to-blue-700 active:scale-95"
        >
          Login / Register
        </button>
      </form>
    </div>
  );
}

export default Login;
