import React, { useState } from "react";
import { registerUser } from "../api/auth";

export default function Signup({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await registerUser({ email, password });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success ? (
        <p className="text-green-600 mb-4">
          Registration successful! You can now{" "}
          <button
            onClick={switchToLogin}
            className="text-indigo-600 hover:underline"
          >
            login
          </button>
          .
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>
      )}
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-indigo-600 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
