import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import { createUser, getUserByEmail } from '../models/users-models.js';
import { getNav } from '../utils/index.js';
import { authenticate } from '../middleware/authenticate.js'; // Adjust the path if necessary

const router = Router();

// Login route
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format.'),
    body('password').notEmpty().withMessage('Password is required.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.error = errors.array()[0].msg;
        return res.redirect('/login');
    }
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            req.session.error = "User not found.";
            return res.redirect('/login');
        }

        console.log("Password entered (login):", password); // Log entered password
        console.log("Stored hash (login):", user.hash_pass); // Log stored hash

        const passwordMatch = await argon2.verify(user.hash_pass, password);
        console.log("Password match (login):", passwordMatch); // Log verification result

        if (!passwordMatch) {
            req.session.error = 'Incorrect password.';
            return res.redirect('/login');
        }

        req.session.user = { id: user.id, email: user.email };
        req.session.message = 'Welcome! You\'re logged in!';
        console.log("req.session after login: ", req.session); // Log session
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login Error:', error);
        req.session.error = 'Internal server error.';
        res.redirect('/login');
    }
});

// Register Route
router.post('/register', [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format.'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters.'),
    body('given_name').notEmpty().withMessage('Given name is required.'),
    body('family_name').notEmpty().withMessage('Family name is required.'),
    body('dob').notEmpty().withMessage('Date of birth is required.'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match.');
        }
        return true;
    }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.error = errors.array()[0].msg;
        return res.redirect('/register');
    }
    try {
        const { email, password, given_name, family_name, dob } = req.body;
        const hashedPassword = await argon2.hash(password);
        console.log("Hashed password (registration):", hashedPassword); // Log hashed password
        await createUser(email, hashedPassword, given_name, family_name, dob);

        req.session.message = 'Registration successful! Please log in.';
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        req.session.error = 'Error registering user.';
        res.redirect('/register');
    }
});

// Logout routes
router.post('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                req.session.error = 'Error logging out.';
                return res.redirect('/dashboard');
            }
            req.session.message = 'Logged out successfully.';
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Logout error:', error);
        req.session.error = 'Internal server error.';
        res.redirect('/dashboard');
    }
});

router.get('/dashboard', authenticate, async (req, res) => {
    const nav = await getNav(req.session.user);
    res.render('dashboard', { nav: nav });
});

router.get('/', authenticate, async (req, res) => {
    const nav = await getNav(req.session.user);
    res.render('index', { nav: nav });
});

export default router;