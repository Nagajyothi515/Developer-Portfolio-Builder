import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, clearAuth } from "../api";
import "../App.css";

function Navbar() {
  const navigate  = useNavigate();
  const loggedIn  = isLoggedIn();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h2 className="logo">DevPortfolio</h2>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {loggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/settings">Settings</Link>
            <button onClick={handleLogout} style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-secondary)",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              marginLeft: "4px",
              fontFamily: "var(--font-body)",
              transition: "var(--transition)",
            }}
            onMouseEnter={e => { e.target.style.color = "var(--danger)"; e.target.style.borderColor = "rgba(252,129,129,0.3)"; }}
            onMouseLeave={e => { e.target.style.color = "var(--text-secondary)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-cta">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;