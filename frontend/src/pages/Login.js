import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import "./Auth.css";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser({ username: email, password });
      localStorage.setItem("token", data.access_token);
      onLoginSuccess();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="auth-content">
        {/* Left Side - Image/Illustration */}
        <div className="auth-image-side">
          <div className="auth-image-content">
            <div className="floating-card">
              <div className="card-icon">🚀</div>
              <h3>Welcome Back!</h3>
              <p>Continue building your perfect resume</p>
            </div>
            <div className="feature-list">
              <div className="feature-item animate-slide-in delay-1">
                <span className="feature-icon">✨</span>
                <span>AI-Powered Analysis</span>
              </div>
              <div className="feature-item animate-slide-in delay-2">
                <span className="feature-icon">📊</span>
                <span>Track Your Progress</span>
              </div>
              <div className="feature-item animate-slide-in delay-3">
                <span className="feature-icon">🎯</span>
                <span>Match Perfect Jobs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Sign In</h2>
              <p className="auth-subtitle">Access your SmartCV dashboard</p>
            </div>

            {error && (
              <div className="error-message animate-shake">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    Sign In
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="auth-link"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

