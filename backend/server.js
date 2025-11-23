const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const { initializeMockData } = require('./src/config/loadMockProducts');
const authRoutes = require('./src/auth/routes/auth.routes');
const productsRoutes = require('./src/products/routes/products.routes');

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);

app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };

    try {
        res.status(200).send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send(healthcheck);
    }
});

connectDB().then(() => {
    console.log('Database connection successful. Initializing mock data...');
    // Call the mock initialization function and wait for it to complete.
    return initializeMockData();
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});