import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, setAuth } from "../api";
import "../App.css";

function Login() {
  const navigate  = useNavigate();
  const [email,    setEmail]   = useState("");
  const [password, setPassword]= useState("");
  const [error,    setError]   = useState("");
  const [loading,  setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("All fields are required"); return; }
    if (!email.includes("@")) { setError("Enter a valid email address"); return; }

    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      setAuth(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Sign in to access your portfolio dashboard</p>
        </div>

        <div className="auth-card">
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;