import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getProfile, updateProfile, getUser } from "../api";
import "../App.css";

function Profile() {
  const navigate = useNavigate();
  const [bio,        setBio]        = useState("");
  const [githubUrl,  setGithubUrl]  = useState("");
  const [linkedinUrl,setLinkedinUrl]= useState("");
  const [saved,      setSaved]      = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const user = getUser();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setBio(data.bio         || "");
        setGithubUrl(data.githubUrl   || "");
        setLinkedinUrl(data.linkedinUrl || "");
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ bio, githubUrl, linkedinUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError("Failed to save profile: " + err.message);
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="profile-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Profile</h1>
            <p className="page-subtitle">This info appears on your public portfolio</p>
          </div>
        </div>

        {/* Avatar preview */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-preview">{initials}</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{user?.fullName || "Your Name"}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{user?.email || ""}</div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            {error  && <div className="error">{error}</div>}
            {saved  && (
              <div style={{
                background: "rgba(104,211,145,0.1)", border: "1px solid rgba(104,211,145,0.3)",
                color: "var(--success)", padding: "10px 14px", borderRadius: "6px",
                fontSize: "13px", marginBottom: "20px",
              }}>
                ✓ Profile saved successfully
              </div>
            )}

            <div className="form-group settings-row full">
              <label className="form-label">Bio</label>
              <textarea className="form-input" placeholder="Tell people about yourself..."
                value={bio} onChange={(e) => setBio(e.target.value)}
                style={{ height: "90px", resize: "none" }} />
            </div>

            <div className="settings-row">
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input className="form-input" type="text"
                  placeholder="https://github.com/username"
                  value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input className="form-input" type="text"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="submit" className="btn-primary">Save Profile</button>
              <button type="button" className="btn-secondary"
                onClick={() => navigate(`/portfolio/${user?.id}`)}>
                Preview Portfolio →
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default Profile;