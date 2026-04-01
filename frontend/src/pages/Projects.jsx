import { useState } from "react";
import "../App.css";

function Projects(){

  const [projects,setProjects] = useState([]);

  const addProject = () => {

    const newProject = {
      id: Date.now(),
      title: "New Project",
      description: "Project description"
    };

    setProjects([...projects,newProject]);
  };

  return (

    <div className="dashboard-container">

      <h1>My Projects</h1>

      <button className="btn-primary" onClick={addProject}>
        Add Project
      </button>

      <div className="project-grid">

        {projects.map((project)=>(
          <div className="project-card" key={project.id}>

            <h3>{project.title}</h3>

            <p>{project.description}</p>

            <button className="btn-secondary">Edit</button>
            <button className="btn-danger">Delete</button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Projects;