const { getDB } = require('../../config/db');

exports.getProducts = async () => {
    const db = getDB();
    try {
        const products = await db.all('SELECT * FROM products');
        return products;
    } catch(err) {
        return null;
    }
};