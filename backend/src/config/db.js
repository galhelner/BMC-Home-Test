const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

let db; // Global variable to hold the database connection

const connectDB = async () => {
    try {
        const dbPath = path.resolve(__dirname, '..', '..', 'db.sqlite');
        
        // Open the database connection
        db = await sqlite.open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('SQLite Database Connected successfully...');
        
        // --- Create User Table if it doesn't exist ---
        await db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('User table ensured.');
        
        return db; // Return the database instance
    } catch (err) {
        console.error('Failed to connect or initialize SQLite:', err.message);
        process.exit(1); 
    }
};

module.exports = { connectDB, getDB: () => db };