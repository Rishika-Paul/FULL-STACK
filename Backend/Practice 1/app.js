// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

app.use(loggerMiddleware);

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // accept "Bearer mysecrettoken"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(400).json({ error: 'Malformed Authorization header. Use: Bearer <token>' });
  }

  const token = parts[1];
  if (token === 'mysecrettoken') {
    return next();
  } else {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

app.get('/public', (req, res) => {
  res.json({ message: 'This is a public route, no token needed!' });
});

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted! You provided the correct token.' });
});
app.use(express.static(__dirname));
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
