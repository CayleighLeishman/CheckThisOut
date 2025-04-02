import express from 'express';
import { 
    createUser, 
    getAllUsers, 
    getUserById, 
    getUserByUsername,
    updateUser, 
    deleteUser, 
    updateRole 
} from '../models/users-models.js';  // Ensure your function names match what's in your users-models.js file
import { createRolesTable } from '../models/roles-models.js'; // Import the function to create roles table

const router = express.Router();

// Route to create a new user
router.post('/users/create', async (req, res) => {
    const { username, email, password, given_name, family_name, dob, role = 'customer' } = req.body;
    try {
        const newUser = await createUser(username, email, password, given_name, family_name, dob, role);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
});

// Update a user
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, given_name, family_name, dob, role } = req.body;

    try {
        const updatedUser = await updateUser(id, username, email, given_name, family_name, dob, role);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
});

export default router;
