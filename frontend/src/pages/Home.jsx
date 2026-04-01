import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Now with SQL Server integration
        </div>

        <h1>
          Your Developer<br />
          Portfolio, <span>Elevated</span>
        </h1>

        <p className="hero-subtitle">
          Build, manage, and share a professional portfolio that gets you noticed.
          Add projects, showcase skills, and let your work speak for itself.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Get Started Free →
          </button>
          <button className="btn-secondary" onClick={() => navigate("/portfolio")}>
            View Demo
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">100%</div>
            <div className="hero-stat-label">Customizable</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">∞</div>
            <div className="hero-stat-label">Projects</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">1</div>
            <div className="hero-stat-label">Shareable link</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="section-label">What you get</div>
        <div className="section-title">Everything you need to stand out</div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">◈</div>
            <h3>Create Portfolio</h3>
            <p>Build a dynamic portfolio that updates in real time as you add projects and skills.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⊞</div>
            <h3>Manage Projects</h3>
            <p>Add, edit, and organize all your development work with GitHub and live demo links.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">◇</div>
            <h3>Share Publicly</h3>
            <p>Get a shareable portfolio link you can send directly to recruiters and clients.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="section-label">How it works</div>
        <div className="section-title">Up and running in minutes</div>

        <div className="steps-grid">
          {[
            { n: "01", title: "Register",        desc: "Create your free account in seconds." },
            { n: "02", title: "Add Projects",    desc: "Paste your GitHub and demo links." },
            { n: "03", title: "Add Skills",      desc: "List your tech stack and expertise." },
            { n: "04", title: "Share & Impress", desc: "Send your portfolio link to anyone." },
          ].map(step => (
            <div className="step-card" key={step.n}>
              <div className="step-number">{step.n}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to build your portfolio?</h2>
        <p>Join developers who use DevPortfolio to land their next opportunity.</p>
        <button className="btn-primary" onClick={() => navigate("/register")}>
          Create your portfolio →
        </button>
      </section>

    </div>
  );
}

export default Home;