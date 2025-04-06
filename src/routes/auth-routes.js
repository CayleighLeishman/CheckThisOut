import express from 'express';
import argon2 from 'argon2';

const router = express.Router();

// Mock user data (remove this once you're connected to a real DB)
const users = [
    { username: 'testuser', hash_pass: '$argon2id$v=19$m=4096,t=3,p=1$2c9d446adfe4c5da$59c64de6f1f1702b960f5b68dd736440' } // Example hashed password
];

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the mock users array
        const user = users.find(u => u.username === username);

        if (!user) {
            req.flash('error_mesg', 'Account does not exist.');
            return res.redirect('/login');
        }

        // Verify the password
        const isMatch = await argon2.verify(user.hash_pass, password);
        if (!isMatch) {
            req.flash('error_mesg', 'Incorrect password.');
            return res.redirect('/login');
        }

        // Login successful
        req.session.user = user; // Store in session
        req.flash('success_mesg', 'Welcome back!');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error_mesg', 'Something went wrong.');
        res.redirect('/login');
    }
});

export default router;
