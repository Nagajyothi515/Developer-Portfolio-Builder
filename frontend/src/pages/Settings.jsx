import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { clearAuth, getUser } from "../api";
import "../App.css";

function Settings() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <div className="settings-layout">
      <Sidebar />
      <main className="settings-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your account and portfolio preferences</p>
          </div>
        </div>

        {/* Portfolio link */}
        <div className="settings-section">
          <div className="settings-section-title">Your Portfolio Link</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "16px" }}>
            Share this link with recruiters and clients.
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input className="form-input" readOnly
              value={`${window.location.origin}/portfolio/${user?.id || ""}`}
              style={{ flex: 1 }} />
            <button className="btn-primary"
              onClick={() => navigate(`/portfolio/${user?.id}`)}>
              View →
            </button>
          </div>
        </div>

        {/* Account info */}
        <div className="settings-section">
          <div className="settings-section-title">Account</div>
          <div className="settings-row">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" readOnly value={user?.fullName || "—"} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" readOnly value={user?.email || "—"} />
            </div>
          </div>
          <button className="btn-secondary" onClick={() => navigate("/profile")}>
            Edit Profile
          </button>
        </div>

        {/* Danger zone */}
        <div className="settings-section">
          <div className="settings-section-title" style={{ color: "var(--danger)" }}>
            Danger Zone
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "16px" }}>
            Once you log out, you'll need to sign in again to access your dashboard.
          </p>
          <button className="btn-danger" onClick={handleLogout}>
            Sign out of account
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;