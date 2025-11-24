const { getDB } = require('./db');
const BASE_URL = 'http://localhost:3000';

const mockProducts = [
    { id: 1, name: 'Premium Espresso Cup', price: 25.99, imageUrl: `${BASE_URL}/assets/espresso-cup.jpg` },
    { id: 2, name: 'Organic Tea Bags', price: 15.50, imageUrl: `${BASE_URL}/assets/tea.jpg` },
    { id: 3, name: 'Ceramic Mug Set', price: 45.00, imageUrl: `${BASE_URL}/assets/mugs.jpg` },
    { id: 4, name: 'Milk Frother', price: 39.99, imageUrl: `${BASE_URL}/assets/frother.jpeg` },
    { id: 5, name: 'Phone Sillicone Case', price: 5.00, imageUrl: `${BASE_URL}/assets/phone-case.jpeg` },
    { id: 6, name: 'Basketball', price: 50.00, imageUrl: `${BASE_URL}/assets/basketball.jpg` },
];

/**
 * Checks if mock data is already present by looking for the first mock product.
 * If found, the full initialization is skipped.
 */
async function checkMockDataExists(db) {
    const checkSql = 'SELECT COUNT(*) as count FROM products WHERE name = ?';
    const result = await db.get(checkSql, [mockProducts[0].name]);
    return result.count > 0;
}

async function initializeMockData() {
    const db = getDB();
    if (!db) {
        throw new Error("Database connection not established. Call connectDB first.");
    }

    try {
        // --- Initial Check to Skip Entire Process ---
        const exists = await checkMockDataExists(db);
        if (exists) {
            console.log('Mock data already detected. Skipping initialization.');
            return;
        }

        console.log('\n--- Inserting Mock Data (First Run) ---');

        // --- Insert Mock Products (Only runs if checkMockDataExists returns false) ---
        let productInsertions = 0;
        const productSql = `
            INSERT OR IGNORE INTO products (name, price, imageUrl)
            VALUES (?, ?, ?);
        `;
        
        await db.run('BEGIN TRANSACTION');
        for (const product of mockProducts) {
            const result = await db.run(productSql, [product.name, product.price, product.imageUrl]);
            if (result.changes > 0) {
                productInsertions++;
            }
        }
        await db.run('COMMIT');
        console.log(`Inserted ${productInsertions} mock product(s).`);

        console.log('--- Mock Data Initialization Complete ---');
    } catch (error) {
        console.error('Error during mock data insertion:', error.message);
        throw error;
    }
}

module.exports = { initializeMockData };