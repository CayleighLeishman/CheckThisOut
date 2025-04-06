import pool from './index.js';
import { createMessage } from './roles-utils.js'; 


// Function to create the roles table
export const createRolesTable = async () => {
    const query = `
       CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES "user"(id), 
        role VARCHAR(50) NOT NULL, 
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    try {
        await pool.query(query);
        const successMessage = createMessage('Roles table created successfully or already exists!', 'success');
        console.log(successMessage.message);
    } catch (error) {
        const errorMessage = createMessage('Uh-oh! There was an error creating the roles table: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to add a new role
export const createRole = async (role, description) => {
    const query = `
        INSERT INTO roles (role, description)
        VALUES ($1, $2)
        RETURNING *
    `;
    const values = [role, description];
    try {
        const res = await pool.query(query, values);
        const successMessage = createMessage('Role created successfully!', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error creating the role: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to get all roles
export const getAllRoles = async () => {
    const query = 'SELECT id, role, description FROM roles';
    try {
        const res = await pool.query(query);
        const successMessage = createMessage('Roles fetched successfully!', 'success');
        console.log(successMessage.message);
        return res.rows;
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error fetching roles: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to get a role by ID
export const getRoleById = async (id) => {
    const query = 'SELECT id, role, description FROM roles WHERE id = $1';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (!res.rows.length) {
            const errorMessage = createMessage('Uh-oh! We couldn’t find that role. Try again!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('Role fetched successfully!', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Something went wrong! Error fetching role: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to update a role
export const updateRole = async (id, role, description) => {
    const query = `
        UPDATE roles
        SET role = $1, description = $2
        WHERE id = $3
        RETURNING *
    `;
    const values = [role, description, id];
    try {
        const res = await pool.query(query, values);
        const successMessage = createMessage('Role updated successfully!', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error updating the role: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to delete a role
export const deleteRole = async (id) => {
    const query = 'DELETE FROM roles WHERE id = $1 RETURNING *';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (res.rows.length === 0) {
            const errorMessage = createMessage('Womp womp... No role found to delete!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('Role deleted successfully!', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error deleting the role: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};