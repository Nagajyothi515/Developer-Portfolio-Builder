const express = require("express");
const cors = require("cors");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// DB CONFIG - SQL Server Auth
// ===============================
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Connect to DB once on startup
sql.connect(dbConfig)
  .then(() => console.log("✅ Connected to SQL Server"))
  .catch((err) => console.error("❌ DB Connection Failed:", err.message));

const JWT_SECRET = process.env.JWT_SECRET || "devportfolio_secret_key";

// ===============================
// MIDDLEWARE - Verify JWT Token
// ===============================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// ===============================
// TEST ROUTES
// ===============================
app.get("/", (req, res) => {
  res.json({ message: "✅ DevPortfolio Backend is running!" });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await sql.query`SELECT GETDATE() AS currentTime`;
    res.json({ message: "✅ Database connected!", data: result.recordset });
  } catch (err) {
    res.status(500).json({ message: "❌ DB Error", error: err.message });
  }
});

// ===============================
// AUTH ROUTES
// ===============================

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await sql.query`
      SELECT id FROM Users WHERE email = ${email}
    `;

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql.query`
      INSERT INTO Users (fullName, email, password, createdAt)
      OUTPUT INSERTED.id, INSERTED.fullName, INSERTED.email
      VALUES (${fullName}, ${email}, ${hashedPassword}, GETDATE())
    `;

    const newUser = result.recordset[0];

    await sql.query`
      INSERT INTO Profiles (userId, bio, githubUrl, linkedinUrl, portfolioTheme)
      VALUES (${newUser.id}, '', '', '', 'default')
    `;

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, fullName: newUser.fullName },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "✅ Registered successfully!",
      token,
      user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const result = await sql.query`
      SELECT id, fullName, email, password FROM Users WHERE email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "✅ Login successful!",
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===============================
// PROJECTS ROUTES
// ===============================

app.get("/api/projects", verifyToken, async (req, res) => {
  try {
    const result = await sql.query`
      SELECT id, title, description, techStack, githubLink, liveLink, createdAt
      FROM Projects
      WHERE userId = ${req.user.id}
      ORDER BY createdAt DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/projects", verifyToken, async (req, res) => {
  const { title, description, techStack, githubLink, liveLink } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Project title is required." });
  }

  try {
    const result = await sql.query`
      INSERT INTO Projects (userId, title, description, techStack, githubLink, liveLink, createdAt)
      OUTPUT INSERTED.*
      VALUES (
        ${req.user.id},
        ${title},
        ${description || ""},
        ${techStack || ""},
        ${githubLink || ""},
        ${liveLink || ""},
        GETDATE()
      )
    `;
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/api/projects/:id", verifyToken, async (req, res) => {
  const { title, description, techStack, githubLink, liveLink } = req.body;
  const projectId = req.params.id;

  try {
    const check = await sql.query`
      SELECT id FROM Projects WHERE id = ${projectId} AND userId = ${req.user.id}
    `;

    if (check.recordset.length === 0) {
      return res.status(404).json({ message: "Project not found." });
    }

    await sql.query`
      UPDATE Projects
      SET
        title       = ${title},
        description = ${description || ""},
        techStack   = ${techStack || ""},
        githubLink  = ${githubLink || ""},
        liveLink    = ${liveLink || ""}
      WHERE id = ${projectId} AND userId = ${req.user.id}
    `;

    res.json({ message: "✅ Project updated!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/api/projects/:id", verifyToken, async (req, res) => {
  const projectId = req.params.id;

  try {
    const check = await sql.query`
      SELECT id FROM Projects WHERE id = ${projectId} AND userId = ${req.user.id}
    `;

    if (check.recordset.length === 0) {
      return res.status(404).json({ message: "Project not found." });
    }

    await sql.query`
      DELETE FROM Projects WHERE id = ${projectId} AND userId = ${req.user.id}
    `;

    res.json({ message: "✅ Project deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===============================
// SKILLS ROUTES
// ===============================

app.get("/api/skills", verifyToken, async (req, res) => {
  try {
    const result = await sql.query`
      SELECT id, skillName, level
      FROM Skills
      WHERE userId = ${req.user.id}
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/skills", verifyToken, async (req, res) => {
  const { skillName, level } = req.body;

  if (!skillName) {
    return res.status(400).json({ message: "Skill name is required." });
  }

  try {
    const result = await sql.query`
      INSERT INTO Skills (userId, skillName, level)
      OUTPUT INSERTED.*
      VALUES (${req.user.id}, ${skillName}, ${level || "Intermediate"})
    `;
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/api/skills/:id", verifyToken, async (req, res) => {
  const skillId = req.params.id;

  try {
    const check = await sql.query`
      SELECT id FROM Skills WHERE id = ${skillId} AND userId = ${req.user.id}
    `;

    if (check.recordset.length === 0) {
      return res.status(404).json({ message: "Skill not found." });
    }

    await sql.query`
      DELETE FROM Skills WHERE id = ${skillId} AND userId = ${req.user.id}
    `;

    res.json({ message: "✅ Skill deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===============================
// PROFILE ROUTES
// ===============================

app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const result = await sql.query`
      SELECT p.id, p.bio, p.githubUrl, p.linkedinUrl, p.portfolioTheme,
             u.fullName, u.email
      FROM Profiles p
      JOIN Users u ON u.id = p.userId
      WHERE p.userId = ${req.user.id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/api/profile", verifyToken, async (req, res) => {
  const { bio, githubUrl, linkedinUrl, portfolioTheme } = req.body;

  try {
    const check = await sql.query`
      SELECT id FROM Profiles WHERE userId = ${req.user.id}
    `;

    if (check.recordset.length === 0) {
      await sql.query`
        INSERT INTO Profiles (userId, bio, githubUrl, linkedinUrl, portfolioTheme)
        VALUES (${req.user.id}, ${bio || ""}, ${githubUrl || ""}, ${linkedinUrl || ""}, ${portfolioTheme || "default"})
      `;
    } else {
      await sql.query`
        UPDATE Profiles
        SET
          bio            = ${bio || ""},
          githubUrl      = ${githubUrl || ""},
          linkedinUrl    = ${linkedinUrl || ""},
          portfolioTheme = ${portfolioTheme || "default"}
        WHERE userId = ${req.user.id}
      `;
    }

    res.json({ message: "✅ Profile updated!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===============================
// PUBLIC PORTFOLIO ROUTE
// ===============================
app.get("/api/portfolio/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const profileResult = await sql.query`
      SELECT u.fullName, u.email, p.bio, p.githubUrl, p.linkedinUrl
      FROM Users u
      LEFT JOIN Profiles p ON p.userId = u.id
      WHERE u.id = ${userId}
    `;

    if (profileResult.recordset.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const projectsResult = await sql.query`
      SELECT title, description, techStack, githubLink, liveLink
      FROM Projects
      WHERE userId = ${userId}
      ORDER BY createdAt DESC
    `;

    const skillsResult = await sql.query`
      SELECT skillName, level
      FROM Skills
      WHERE userId = ${userId}
    `;

    res.json({
      profile:  profileResult.recordset[0],
      projects: projectsResult.recordset,
      skills:   skillsResult.recordset,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});