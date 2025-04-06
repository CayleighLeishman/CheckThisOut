import express from 'express';
import { createRole, getAllRoles, getRoleById, updateRole, deleteRole } from '../models/roles-models.js'; // Assuming you'll have these functions

const router = express.Router();

// Create a new role
router.post('/roles', async (req, res) => {
    const { name } = req.body;
    try {
        const newRole = await createRole(name);
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all roles
router.get('/roles', async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch roles', details: error.message });
    }
});

// Get a role by ID
router.get('/roles/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const role = await getRoleById(id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch role', details: error.message });
    }
});

// Update a role
router.put('/roles/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedRole = await updateRole(id, name);
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update role', details: error.message });
    }
});

// Delete a role
router.delete('/roles/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRole = await deleteRole(id);
        if (!deletedRole) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.status(200).json(deletedRole);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete role', details: error.message });
    }
});

export default router;