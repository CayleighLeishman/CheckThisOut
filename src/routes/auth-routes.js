import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import { createUser, getUserByEmail } from '../models/users-models.js'; // Import getUserByEmail

const router = Router();

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email); // Use getUserByEmail
        if (!user) {
            return res.status(401).send('User not found!');
        }

        const passwordMatch = await argon2.verify(user.hash_pass, password); // Access hash_pass
        if (!passwordMatch) {
            return res.status(401).send('Incorrect password.');
        }

        req.session.user = { id: user.id, email: user.email };
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Register Route
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }),
    body('given_name').escape(),
    body('family_name').escape(),
    body('dob').escape(),
], async (req, res) => {
    console.log("src/auth-routes:line40")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, given_name, family_name, dob } = req.body;
        const hashedPassword = await argon2.hash(password);
        await createUser(email, hashedPassword, given_name, family_name, dob);

        return res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Error registering user' });
    }
});

// Logout route
router.post('/logout', async (req, res) => {
    // ... (your logout route)
});

export default router;