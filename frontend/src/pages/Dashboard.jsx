import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AddProjectModal from "../components/AddProjectModal";
import { getProjects, addProject, updateProject, deleteProject } from "../api";
import "../App.css";

function Dashboard() {
  const [projects,  setProjects]  = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (project) => {
    try {
      const newProject = await addProject({
        title:      project.title,
        description:project.description,
        techStack:  project.tech,
        githubLink: project.github,
        liveLink:   project.demo,
      });
      setProjects([newProject, ...projects]);
    } catch (err) {
      alert("Failed to add project: " + err.message);
    }
  };

  const handleEdit = async (project) => {
    try {
      await updateProject(editProject.id, {
        title:      project.title,
        description:project.description,
        techStack:  project.tech,
        githubLink: project.github,
        liveLink:   project.demo,
      });
      fetchProjects(); // Refresh list
    } catch (err) {
      alert("Failed to update project: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const techBadges = (techString) =>
    techString ? techString.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Projects</h1>
            <p className="page-subtitle">Manage and showcase your development work</p>
          </div>
          <button className="btn-primary" onClick={() => { setEditProject(null); setShowModal(true); }}>
            + Add Project
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card-label">Total Projects</div>
            <div className="stat-card-value"><span>{projects.length}</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">With GitHub</div>
            <div className="stat-card-value"><span>{projects.filter(p => p.githubLink).length}</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Live Demos</div>
            <div className="stat-card-value"><span>{projects.filter(p => p.liveLink).length}</span></div>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Projects Grid */}
        <div className="project-grid">
          {loading ? (
            <p style={{ color: "var(--text-muted)", padding: "40px" }}>Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⊞</div>
              <h3>No projects yet</h3>
              <p>Add your first project to get started</p>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                + Add your first project
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-card-header">
                  <h3>{project.title}</h3>
                </div>
                <p className="project-card-desc">{project.description}</p>

                {project.techStack && (
                  <div className="tech-stack">
                    {techBadges(project.techStack).map((t, i) => (
                      <span className="tech-badge" key={i}>{t}</span>
                    ))}
                  </div>
                )}

                {(project.githubLink || project.liveLink) && (
                  <div className="project-links">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="project-link">
                        ⌥ GitHub
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="project-link">
                        ◇ Live Demo
                      </a>
                    )}
                  </div>
                )}

                <div className="project-actions">
                  <button className="btn-ghost" onClick={() => { setEditProject(project); setShowModal(true); }}>
                    ✎ Edit
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(project.id)}>
                    ✕ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showModal && (
        <AddProjectModal
          closeModal={() => { setShowModal(false); setEditProject(null); }}
          addProject={handleAdd}
          editProject={handleEdit}
          projectData={editProject ? {
            title:      editProject.title,
            description:editProject.description,
            tech:       editProject.techStack,
            github:     editProject.githubLink,
            demo:       editProject.liveLink,
          } : null}
        />
      )}
    </div>
  );
}

export default Dashboard;