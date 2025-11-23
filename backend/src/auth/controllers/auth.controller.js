const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }
        const { id, token } = await authService.createUser(email, password);
        res.status(201).json({ id, token });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error during register.');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password!' });
        }

        const user = await authService.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials.' });
        }

        const token = authService.getToken(user.id);
        res.status(200).json({ id: user.id, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login.');
    }
};

exports.logout = async (req, res) => {
    // client remove its jwt token
    res.status(200).json({ message: 'Logout successful.' });
};