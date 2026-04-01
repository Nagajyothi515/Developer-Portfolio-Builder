import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getSkills, addSkill, deleteSkill } from "../api";
import "../App.css";

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Expert"];

function Skills() {
  const [skills,     setSkills]     = useState([]);
  const [skillName,  setSkillName]  = useState("");
  const [level,      setLevel]      = useState("Intermediate");
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!skillName.trim()) return;
    try {
      const newSkill = await addSkill(skillName.trim(), level);
      setSkills([...skills, newSkill]);
      setSkillName("");
    } catch (err) {
      alert("Failed to add skill: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete skill: " + err.message);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } };

  const levelColor = (lvl) => ({
    Beginner:     "var(--text-muted)",
    Intermediate: "var(--accent)",
    Advanced:     "var(--accent-2)",
    Expert:       "#f6ad55",
  }[lvl] || "var(--text-muted)");

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="skills-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Skills</h1>
            <p className="page-subtitle">Showcase your technical expertise on your portfolio</p>
          </div>
        </div>

        {/* Add skill bar */}
        <div className="add-skill-bar">
          <input className="form-input" type="text"
            placeholder="Skill name (e.g. React, Python, SQL...)"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            onKeyDown={handleKey}
          />
          <select className="form-input" value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{ width: "160px", flex: "none", cursor: "pointer" }}>
            {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <button className="btn-primary" onClick={handleAdd}>+ Add</button>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading skills...</p>
        ) : skills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <h3>No skills added yet</h3>
            <p>Add your first skill above</p>
          </div>
        ) : (
          <div className="skills-list">
            {skills.map(skill => (
              <div className="skill-item" key={skill.id}>
                <div>
                  <div className="skill-item-name">{skill.skillName}</div>
                  <div className="skill-level" style={{ color: levelColor(skill.level) }}>
                    {skill.level}
                  </div>
                </div>
                <button className="btn-danger" onClick={() => handleDelete(skill.id)}
                  style={{ padding: "5px 10px", fontSize: "12px" }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Skills;