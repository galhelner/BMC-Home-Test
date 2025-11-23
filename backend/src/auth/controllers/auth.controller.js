const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this email is already exists!' });
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

        const isAuth = await authService.authenticateUser(email, password);

        if (!isAuth) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = await authService.findUserByEmail(email);
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