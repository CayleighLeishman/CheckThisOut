import express from 'express';
import { getUserById, createUser } from '../../models/users-models.js';

const router = express.Router();

// GET a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST (create) a new user
router.post('/', async (req, res) => {
    const { email, password, given_name, family_name, dob } = req.body;

    try {
        const newUser = await createUser(email, password, given_name, family_name, dob);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;