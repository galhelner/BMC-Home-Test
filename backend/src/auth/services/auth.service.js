const jwt = require('jsonwebtoken');
const { getDB } = require('../../config/db');

// --- Helper Function: Generate JWT Token ---
const generateToken = (userId) => {
    const payload = {
        id: userId
    };

    // Sign the token using the secret key from environment variables
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
    );
};

exports.findUserByEmail = async (email) => {
    const db = getDB();
    return db.get('SELECT * FROM users WHERE email = ?', [email]);
};

exports.findUserById = async (id) => {
    const db = getDB();
    return db.get('SELECT id, email, date FROM users WHERE id = ?', [id]);
};

exports.createUser = async (email, hashedPassword) => {
    const db = getDB();
    const result = await db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
    );

    const newUserId = result.lastID;
    const authToken = generateToken(newUserId);
    
    return {"id": newUserId, "token": authToken};
};

exports.getToken = (id) => {
    return generateToken(id)
};