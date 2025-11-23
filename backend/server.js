const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db');
const authRoutes = require('./src/auth/routes/auth.routes');

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
});