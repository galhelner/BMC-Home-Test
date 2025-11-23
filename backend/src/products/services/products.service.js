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

exports.addProductToCart = async (user_id, product_id) => {
    const db = getDB();
    try {
        const sql_query = `
            INSERT INTO carts (user_id, product_id, quantity)
            VALUES (?, ?, 1)
            ON CONFLICT (user_id, product_id) DO UPDATE SET 
            quantity = quantity + 1
        `;

        const result = await db.run(sql_query, [user_id, product_id]);

        return result.changes > 0;
    } catch(err) {
        return false;
    }
};

exports.updateCart = async (user_id, product_id, quantity) => {
    const db = getDB();
    try {
        const sql_query = `
            UPDATE carts
            SET quantity = ? 
            WHERE user_id = ? AND product_id = ?
        `;

        const result = await db.run(sql_query, [quantity, user_id, product_id]);

        return result.changes > 0;
    } catch(err) {
        return false;
    }
}

exports.deleteProductFromCart = async (user_id, product_id) => {
    const db = getDB();
    try {
        const sql_query = `
            DELETE FROM carts
            WHERE user_id = ? AND product_id = ?

        `;
        const result = await db.run(sql_query, [user_id, product_id]);
        return result.changes > 0;

    } catch (err) {
        return false;
    }
}

exports.getCartItems = async (user_id) => {
    const db = getDB();
    try {
        const sql_query = `
            SELECT 
                c.quantity, 
                p.id AS product_id,
                p.name, 
                p.price, 
                p.imageUrl
            FROM carts c
            INNER JOIN products p 
            ON c.product_id = p.id
            WHERE c.user_id = ?
        `;
        
        const cartItems = await db.all(sql_query, [user_id]);
        
        const formattedCart = cartItems.map(item => ({
            product: {
                id: item.product_id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl
            },
            quantity: item.quantity
        }));
        
        return formattedCart;

    } catch (err) {
        console.error('Error fetching cart items:', err.message);
        return null;
    }
}