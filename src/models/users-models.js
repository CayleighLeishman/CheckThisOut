import pool from './index.js';
import { pass_hash, verifyPassword } from '../utils/auth.js';
import { createMessage } from '../utils/notif.js';

// Function to create the users table
const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            hash_pass VARCHAR(255) NOT NULL,
            given_name VARCHAR(100),
            family_name VARCHAR(100),
            dob DATE,
            last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        const successMessage = createMessage('Users table created successfully or already exists! ', 'success');
        console.log(successMessage.message);
    } catch (error) {
        const errorMessage = createMessage('Uh-oh! There was an error creating the users table: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to add a new user 
const createUser = async (email, password, given_name, family_name, dob) => {
    try {
        const query = format(
            'INSERT INTO users (email, hash_pass, given_name, family_name, dob) VALUES (%L, %L, %L, %L, %L) RETURNING *',
            email,
            password,
            given_name,
            family_name,
            dob
        );
        const res = await pool.query(query);
        return res.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Function to get all users
const getAllUsers = async () => {
    const query = 'SELECT id, email, given_name, family_name, dob';
    try {
        const res = await pool.query(query);
        const successMessage = createMessage('Users fetched successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows;
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error fetching users: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to get a user by ID
const getUserById = async (id) => {
    const query = 'SELECT id, email, given_name, family_name, dob';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (!res.rows.length) {
            const errorMessage = createMessage('Uh-oh! We couldn’t find that user. Try again!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('User fetched successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Something went wrong! Error fetching user: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to update a user
const updateUser = async (id, email, given_name, family_name, dob) => {
    try{
        const query = format(
            'UPDATE users SET email = %L, given_name = %L, family_name = %L, dob = %L WHERE id = %L RETURNING *',
            email, given_name, family_name, dob, id
        );
        const res = await pool.query(query);
        return res.rows[0]
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Function to delete a user
const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (res.rows.length === 0) {
            const errorMessage = createMessage('Womp womp... No user found to delete!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('User deleted successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error deleting the user: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to validate and update the date of birth
const validateAndUpdateDob = async (id, dob) => {
    if (dob === null || dob === undefined) {
        throw new Error('Date of birth is required');
    }
    if (isNaN(Date.parse(dob))) {
        throw new Error('Invalid date of birth');
    }

    const query = 'UPDATE users SET dob = $1 WHERE id = $2 RETURNING *';
    const values = [dob, id];
    try {
        const res = await pool.query(query, values);
        const successMessage = createMessage('Date of birth updated successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error updating the date of birth: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Update last logged in time
const updateLastLoggedIn = async (userId) => {
    const query = `
        UPDATE users
        SET last_login = NOW()
        WHERE id = $1
        RETURNING *
    `;
    const values = [userId];
    try {
        const res = await pool.query(query, values);
        console.log('User last logged in time updated!');
        return res.rows[0];
    } catch (error) {
        console.error('Error updating last logged in time:', error.message);
        throw error;
    }
};

// Password hashing and verification
const verifyUserPassword = async (email, password) => {
    const user = await getUserByEmail(email);
    if (user && await verifyPassword(password, user.hash_pass)) {
        return user; // Authentication successful
    } else {
        throw new Error('Invalid email or password');
    }
};


// Function to retrieve a user from the database by their email address
const getUserByEmail = async (email) => {
    const query = 'SELECT id, email, password, given_name, family_name, dob';
    const values = [email];
    try {
        const res = await pool.query(query, values);
        if (!res.rows.length) {
            console.log('Uh-oh! We couldn’t find that Username. Try again!', 'error');
            return null;
        }
        console.log(('src/models/users-models: User fetched successfully! ', 'success'));
        return res.rows[0]; // Returning the user details
    } catch (error) {
        console.error('Something went wrong! Error fetching user: ' + error.message, 'error');
        throw error;
    }
};

export {
    createUsersTable,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    validateAndUpdateDob,
    updateLastLoggedIn,
    verifyUserPassword,
    getUserByEmail
};
