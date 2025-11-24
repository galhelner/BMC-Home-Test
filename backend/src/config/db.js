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

        // --- Create Product Table if it doesn't exist ---
        await db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                imageUrl TEXT NOT NULL
            )
        `);
        console.log('Products table ensured.');

        // --- Create Carts table if it doesn't exist ---
        await db.run(`
             CREATE TABLE IF NOT EXISTS carts (
                user_id INTEGER,
                product_id INTEGER,
                quantity INTEGER NOT NULL,

                PRIMARY KEY (user_id, product_id),
                FOREIGN KEY (user_id) REFERENCES users(id) 
                ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) 
                ON DELETE CASCADE
            )
        `);

        return db; // Return the database instance
    } catch (err) {
        console.error('Failed to connect or initialize SQLite:', err.message);
        process.exit(1);
    }
};

module.exports = { connectDB, getDB: () => db };