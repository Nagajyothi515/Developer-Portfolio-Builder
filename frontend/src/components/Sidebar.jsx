import { Link, useLocation } from "react-router-dom";
import "../App.css";

const navItems = [
  { path: "/dashboard", icon: "⊞", label: "Projects" },
  { path: "/profile",   icon: "◎", label: "Profile" },
  { path: "/skills",    icon: "◈", label: "Skills" },
  { path: "/settings",  icon: "◉", label: "Settings" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-label">Menu</div>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Public</div>
        <Link to="/portfolio" className="sidebar-link">
          <span className="sidebar-link-icon">◇</span>
          Portfolio
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;