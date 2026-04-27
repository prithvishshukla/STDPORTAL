// =============================================
//  Student Portal - Backend Server
//  Run: node server.js
//  API runs at: http://localhost:3001/api
// =============================================

const express    = require('express');
const cors       = require('cors');
const fs         = require('fs');
const path       = require('path');

const app  = express();
const PORT = 3001;

// Path to our JSON "database"
const DATA_FILE = path.join(__dirname, 'data.json');

// ── Middleware ────────────────────────────────
app.use(cors());                                        // Allow frontend requests
app.use(express.json());                                // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../')));   // Serve frontend files

// =============================================
//  HELPER FUNCTIONS
// =============================================

// readData() → safely read users array from data.json
function readData() {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        // If file is missing or broken, return empty array
        return [];
    }
}

// writeData() → save updated users array to data.json
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// =============================================
//  API ROUTES
// =============================================

// --------------------------------------------
// POST /api/register
// Body: { fullName, username, email, password, studentId }
// --------------------------------------------
app.post('/api/register', (req, res) => {
    const { fullName, username, email, password, studentId } = req.body;

    // Basic validation — all fields required
    if (!fullName || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Read existing users
    const users = readData();

    // Check if email OR username is already taken
    const emailExists    = users.find(u => u.email === email);
    const usernameExists = users.find(u => u.username === username);

    if (emailExists) {
        return res.status(409).json({ error: 'Email already registered' });
    }
    if (usernameExists) {
        return res.status(409).json({ error: 'Username already exists' });
    }

    // Build new user object (matches frontend fields exactly)
    const newUser = {
        fullName,
        username,
        email,
        password,
        studentId: studentId || ''
    };

    // Save to data.json
    users.push(newUser);
    writeData(users);

    return res.status(201).json({ message: 'User registered successfully' });
});

// --------------------------------------------
// POST /api/login
// Body: { username, password }
// --------------------------------------------
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Read existing users
    const users = readData();

    // Find user by username AND password
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return success with user data (no password)
    const { password: _, ...safeUser } = user;
    return res.status(200).json({
        message: 'Login successful',
        student: safeUser
    });
});

// --------------------------------------------
// GET /api/users
// Returns all registered users (for viva demo)
// --------------------------------------------
app.get('/api/users', (req, res) => {
    const users = readData();

    // Return all users without passwords
    const safeUsers = users.map(({ password: _, ...u }) => u);
    return res.status(200).json(safeUsers);
});

// ── Start Server ──────────────────────────────
app.listen(PORT, () => {
    console.log(`✅  Server running on http://localhost:${PORT}`);
    console.log('');
    console.log('Available APIs:');
    console.log(`  POST http://localhost:${PORT}/api/register`);
    console.log(`  POST http://localhost:${PORT}/api/login`);
    console.log(`  GET  http://localhost:${PORT}/api/users`);
});
