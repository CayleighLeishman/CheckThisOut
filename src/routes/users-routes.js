import express from 'express';
import { 
    createUser, 
    getAllUsers, 
    getUserById, 
    getUserByEamil,
    updateUser, 
    deleteUser, 
} from '../models/users-models.js';

const router = express.Router();

router.post('/users/create', async (req, res) => {
    const { username, email, password, given_name, family_name, dob, role_id } = req.body; // Use role_id
    try {
        const newUser = await createUser(username, email, password, given_name, family_name, dob, role_id);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ... (other user routes)

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, given_name, family_name, dob, role_id } = req.body; // Use role_id

    try {
        const updatedUser = await updateUser(id, username, email, given_name, family_name, dob, role_id);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});

// rest of user routes


export default router;