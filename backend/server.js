// =============================================
//  Student Portal - Backend Server
//  Deployment-ready for Render / Railway
//  APIs: POST /api/register
//        POST /api/login
//        GET  /api/users
// =============================================

const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;

// Path to our JSON "database"
const DATA_FILE = path.join(__dirname, 'data.json');

// ── Middleware ────────────────────────────────

// Allow requests from any origin (needed for Vercel → Render cross-origin)
app.use(cors({
    origin: '*',              // Accept from any domain (Vercel, localhost, etc.)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());     // Parse JSON request bodies

// =============================================
//  HELPER FUNCTIONS
// =============================================

// readData() → safely read users array from data.json
function readData() {
    try {
        // If the file doesn't exist yet, create it with an empty array
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, '[]', 'utf8');
            return [];
        }
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed  = JSON.parse(content);
        // Ensure it's always an array
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('readData error:', err.message);
        return [];
    }
}

// writeData() → save updated users array to data.json
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('writeData error:', err.message);
        throw new Error('Failed to save data');
    }
}

// =============================================
//  API ROUTES
// =============================================

// Health check — useful for Render uptime monitoring
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Student Portal API is running ✅' });
});

// --------------------------------------------
// POST /api/register
// Body: { fullName, username, email, password, studentId }
// --------------------------------------------
app.post('/api/register', (req, res) => {
    const { fullName, username, email, password, studentId } = req.body;

    // Basic validation — required fields
    if (!fullName || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Read existing users
    const users = readData();

    // Check for duplicate email or username
    const emailExists    = users.find(u => u.email    === email);
    const usernameExists = users.find(u => u.username === username);

    if (emailExists) {
        return res.status(409).json({ error: 'Email already registered' });
    }
    if (usernameExists) {
        return res.status(409).json({ error: 'Username already exists' });
    }

    // Build new user object
    const newUser = {
        fullName,
        username,
        email,
        password,                   // Plain text (no hashing — beginner-friendly)
        studentId: studentId || ''
    };

    // Save to data.json
    users.push(newUser);
    try {
        writeData(users);
    } catch (err) {
        return res.status(500).json({ error: 'Could not save user. Try again.' });
    }

    return res.status(201).json({ message: 'User registered successfully' });
});

// --------------------------------------------
// POST /api/login
// Body: { username, password }
// --------------------------------------------
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const users = readData();

    // Find user by username AND password
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return user data WITHOUT the password field
    const { password: _, ...safeUser } = user;
    return res.status(200).json({
        message: 'Login successful',
        student: safeUser
    });
});

// --------------------------------------------
// GET /api/users
// Returns all registered users (passwords hidden)
// --------------------------------------------
app.get('/api/users', (req, res) => {
    const users     = readData();
    const safeUsers = users.map(({ password: _, ...u }) => u);
    return res.status(200).json(safeUsers);
});

// ── Start Server ──────────────────────────────
app.listen(PORT, () => {
    console.log(`✅  Server running on port ${PORT}`);
    console.log('');
    console.log('Available APIs:');
    console.log(`  GET  /`);
    console.log(`  POST /api/register`);
    console.log(`  POST /api/login`);
    console.log(`  GET  /api/users`);
});
