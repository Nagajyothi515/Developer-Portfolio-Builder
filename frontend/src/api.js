// ===============================
// API BASE URL
// ===============================
const BASE_URL = "http://localhost:5000/api";

// ===============================
// TOKEN HELPERS
// ===============================
export const getToken = () => localStorage.getItem("token");

export const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

export const isLoggedIn = () => !!getToken();

// ===============================
// FETCH HELPER
// ===============================
const request = async (endpoint, method = "GET", body = null, auth = true) => {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ===============================
// AUTH API
// ===============================
export const registerUser = (fullName, email, password) =>
  request("/auth/register", "POST", { fullName, email, password }, false);

export const loginUser = (email, password) =>
  request("/auth/login", "POST", { email, password }, false);

// ===============================
// PROJECTS API
// ===============================
export const getProjects = () => request("/projects");

export const addProject = (project) => request("/projects", "POST", project);

export const updateProject = (id, project) =>
  request(`/projects/${id}`, "PUT", project);

export const deleteProject = (id) => request(`/projects/${id}`, "DELETE");

// ===============================
// SKILLS API
// ===============================
export const getSkills = () => request("/skills");

export const addSkill = (skillName, level) =>
  request("/skills", "POST", { skillName, level });

export const deleteSkill = (id) => request(`/skills/${id}`, "DELETE");

// ===============================
// PROFILE API
// ===============================
export const getProfile = () => request("/profile");

export const updateProfile = (profileData) =>
  request("/profile", "PUT", profileData);

// ===============================
// PUBLIC PORTFOLIO API
// ===============================
export const getPublicPortfolio = (userId) =>
  request(`/portfolio/${userId}`, "GET", null, false);