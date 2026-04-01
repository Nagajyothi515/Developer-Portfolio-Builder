import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home      from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Profile   from "./pages/Profile";
import Projects  from "./pages/Projects";
import Skills    from "./pages/Skills";
import Settings  from "./pages/Settings";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/portfolio"         element={<Portfolio />} />
        <Route path="/portfolio/:userId" element={<Portfolio />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/profile"           element={<Profile />} />
        <Route path="/projects"          element={<Projects />} />
        <Route path="/skills"            element={<Skills />} />
        <Route path="/settings"          element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;