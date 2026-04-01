import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, setAuth } from "../api";
import "../App.css";

function Register() {
  const navigate  = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) { setError("All fields are required"); return; }
    if (!email.includes("@"))             { setError("Enter a valid email address"); return; }
    if (password.length < 6)              { setError("Password must be at least 6 characters"); return; }

    setError("");
    setLoading(true);
    try {
      const data = await registerUser(fullName, email, password);
      setAuth(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h2>Create your account</h2>
          <p>Start building your developer portfolio for free</p>
        </div>

        <div className="auth-card">
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="John Doe"
                value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
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
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;