const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'mybanksecret';

app.use(bodyParser.json());
app.use(cors());

let account = { username: 'user1', password: 'password123', balance: 1000 };

// 🔒 Middleware for JWT verification
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// 🧾 Login Route (Public)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === account.username && password === account.password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// 💰 Protected Routes
app.get('/balance', authMiddleware, (req, res) => {
    res.json({ balance: account.balance });
});

app.post('/deposit', authMiddleware, (req, res) => {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ error: 'Deposit amount must be positive' });
    account.balance += amount;
    res.json({ balance: account.balance });
});

app.post('/withdraw', authMiddleware, (req, res) => {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ error: 'Withdrawal amount must be positive' });
    if (amount > account.balance) return res.status(400).json({ error: 'Insufficient balance' });
    account.balance -= amount;
    res.json({ balance: account.balance });
});

app.use(express.static(__dirname));
app.listen(PORT, () => {
    console.log(`Banking API running on http://localhost:${PORT}`);
});
