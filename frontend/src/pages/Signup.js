import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api/auth";
import "./Auth.css";

export default function Signup({ onSignupSuccess }) {
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
      // Register the user
      await registerUser({ email, password });
      
      // Auto-login after successful registration
      const loginData = await loginUser({ username: email, password });
      localStorage.setItem("token", loginData.access_token);
      
      // Notify parent and redirect to dashboard
      if (onSignupSuccess) onSignupSuccess();
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
              <div className="card-icon">✨</div>
              <h3>Start Your Journey</h3>
              <p>Create your smart resume in minutes</p>
            </div>
            <div className="feature-list">
              <div className="feature-item animate-slide-in delay-1">
                <span className="feature-icon">🎨</span>
                <span>Beautiful Templates</span>
              </div>
              <div className="feature-item animate-slide-in delay-2">
                <span className="feature-icon">🤖</span>
                <span>AI Suggestions</span>
              </div>
              <div className="feature-item animate-slide-in delay-3">
                <span className="feature-icon">📱</span>
                <span>Share Anywhere</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join SmartCV and build your future</p>
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
                    minLength="6"
                  />
                </div>
                <p className="input-hint">Minimum 6 characters</p>
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
                    Create Account
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="auth-link"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
