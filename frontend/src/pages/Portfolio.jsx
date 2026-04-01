import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicPortfolio, getUser, getProfile, getProjects, getSkills } from "../api";

function Portfolio() {
  const { userId } = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userId) {
          // Public portfolio by userId
          const result = await getPublicPortfolio(userId);
          setData(result);
        } else {
          // Logged-in user's own portfolio
          const [profile, projects, skills] = await Promise.all([
            getProfile(),
            getProjects(),
            getSkills(),
          ]);
          setData({ profile, projects, skills });
        }
      } catch (err) {
        setError("Failed to load portfolio.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) return (
    <div style={{ padding: "80px", textAlign: "center", color: "var(--text-muted)" }}>
      Loading portfolio...
    </div>
  );

  if (error) return (
    <div style={{ padding: "80px", textAlign: "center", color: "var(--danger)" }}>
      {error}
    </div>
  );

  const { profile, projects, skills } = data || {};

  const initials = (profile?.fullName || profile?.name || "Dev")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const techBadges = (techString) =>
    techString ? techString.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="portfolio-page">

      {/* Hero */}
      <div className="portfolio-hero">
        <div className="portfolio-avatar">{initials}</div>
        <div className="portfolio-hero-info">
          <h1>{profile?.fullName || profile?.name || "Developer"}</h1>
          <p className="bio">{profile?.bio || "Full Stack Developer — building things for the web."}</p>
          <div className="portfolio-social-links">
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="portfolio-social-link">
                ⌥ GitHub
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="portfolio-social-link">
                ◈ LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="portfolio-section">
          <h2 className="portfolio-section-title">Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, i) => (
              <span className="skill-pill" key={skill.id || i}>
                {skill.skillName || skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div className="portfolio-section">
        <h2 className="portfolio-section-title">Projects</h2>
        {!projects?.length ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No projects added yet.</p>
        ) : (
          <div className="portfolio-projects-grid">
            {projects.map((project, index) => (
              <div className="portfolio-card" key={project.id || index}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {(project.techStack || project.tech) && (
                  <div className="portfolio-card-tech">
                    {techBadges(project.techStack || project.tech).map((t, i) => (
                      <span className="tech-badge" key={i}>{t}</span>
                    ))}
                  </div>
                )}
                <div className="portfolio-card-links">
                  {(project.githubLink || project.github) && (
                    <a href={project.githubLink || project.github}
                      target="_blank" rel="noreferrer" className="portfolio-card-link">
                      ⌥ GitHub →
                    </a>
                  )}
                  {(project.liveLink || project.demo) && (
                    <a href={project.liveLink || project.demo}
                      target="_blank" rel="noreferrer" className="portfolio-card-link">
                      ◇ Live Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Portfolio;