import { useState, useEffect } from "react";

function AddProjectModal({ closeModal, addProject, editProject, projectData }) {
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [tech,        setTech]        = useState("");
  const [github,      setGithub]      = useState("");
  const [demo,        setDemo]        = useState("");
  const [linkedin,    setLinkedin]    = useState("");

  useEffect(() => {
    if (projectData) {
      setTitle(projectData.title       || "");
      setDescription(projectData.description || "");
      setTech(projectData.tech         || "");
      setGithub(projectData.github     || "");
      setDemo(projectData.demo         || "");
      setLinkedin(projectData.linkedin || "");
    }
  }, [projectData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const project = { title, description, tech, github, demo, linkedin };
    if (projectData) {
      editProject(project);
    } else {
      addProject(project);
    }
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">

        <div className="modal-header">
          <h2>{projectData ? "Edit Project" : "Add New Project"}</h2>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project title *"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Project description *"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tech stack (e.g. React, Node.js, SQL)"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
          />
          <input
            type="text"
            placeholder="GitHub URL"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          <input
            type="text"
            placeholder="Live demo URL"
            value={demo}
            onChange={(e) => setDemo(e.target.value)}
          />
          <input
            type="text"
            placeholder="LinkedIn post URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />

          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              {projectData ? "Update Project" : "Add Project"}
            </button>
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddProjectModal;