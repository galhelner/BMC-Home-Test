const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { getDB } = require('../../config/db');

const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

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

const findUserByEmail = async (email) => {
    const db = getDB();
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
};

exports.findUserByEmail = findUserByEmail; // Export the function

exports.findUserById = async (id) => {
    const db = getDB();
    return await db.get('SELECT id, email, date FROM users WHERE id = ?', [id]);
};

exports.authenticateUser = async (email, password) => {
    const user = await this.findUserByEmail(email);

    if (!user) {
        return false;
    }

    return await bcryptjs.compare(password, user.password);
}

exports.createUser = async (email, password) => {
    const db = getDB();

    const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
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