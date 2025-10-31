// App.jsx

// Import required modules
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Secret key for JWT signing
const JWT_SECRET = "mysecretkey";

// Sample users with roles
const users = [
  { id: 1, username: "adminUser", password: "admin123", role: "Admin" },
  { id: 2, username: "modUser", password: "mod123", role: "Moderator" },
  { id: 3, username: "normalUser", password: "user123", role: "User" },
];

// ---------------------- LOGIN ROUTE ---------------------- //
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!foundUser) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Include role in the token payload
  const token = jwt.sign(
    { id: foundUser.id, username: foundUser.username, role: foundUser.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// ---------------------- VERIFY TOKEN MIDDLEWARE ---------------------- //
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// ---------------------- ROLE CHECK MIDDLEWARE ---------------------- //
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' not allowed.`,
      });
    }
    next();
  };
}

// ---------------------- PROTECTED ROUTES ---------------------- //
app.get("/admin-dashboard", verifyToken, authorizeRoles("Admin"), (req, res) => {
  res.json({
    message: "Welcome to the Admin dashboard",
    user: req.user,
  });
});

app.get("/moderator-panel", verifyToken, authorizeRoles("Moderator"), (req, res) => {
  res.json({
    message: "Welcome to the Moderator panel",
    user: req.user,
  });
});

app.get("/user-profile", verifyToken, authorizeRoles("User", "Admin", "Moderator"), (req, res) => {
  res.json({
    message: "Welcome to your profile page",
    user: req.user,
  });
});

// ---------------------- START SERVER ---------------------- //
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
