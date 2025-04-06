import pool from './index.js';
import { pass_hash } from '../utils/auth.js';
import { verifyPassword } from '../utils/auth.js'; // assuming you have this helper

// Function to create flash messages with playful touches
export const createMessage = (message, type = 'info') => {
    const allowedTypes = ['info', 'success', 'error', 'warning'];
    if (!allowedTypes.includes(type)) {
        type = 'info';
    }

    // Playful messages based on type and to add a bit of fun to the responses
    const playfulMessages = {
        success: [
            'Success achieved! 🎉 Your task is complete!',
            'Great work! Your task was executed flawlessly!',
            'Congratulations! Your efforts have paid off!',
            'Mission accomplished! The task has been completed successfully!'
        ],
        error: [
            'Apologies, something went wrong... We’ll resolve this promptly!',
            'Uh-oh! There was an unexpected issue, but we’ll sort it out soon!',
            'Unfortunately, an error occurred. We’re working on it!',
            'There seems to be a problem... but we’ll fix it in no time!'
        ],
        info: ['Just a quick update. Everything is moving along smoothly.'],
        warning: ['Attention required! Please check the details to proceed.']
    };
    
    // If the message is not in the predefined playful messages, return the original message
    return {
        message: playfulMessages[type][Math.floor(Math.random() * playfulMessages[type].length)] || message,
        type, // 'info', 'success', 'error', or 'warning'
        timestamp: new Date().toISOString() // Timestamp to help track when the message was created
    };
};

// Function to create the users table
export const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            given_name VARCHAR(100),
            family_name VARCHAR(100),
            dob DATE,
            last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        )
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
export const createUser = async (username, email, password, given_name, family_name, dob, role = 'customer') => {
    try {
        const hashedPassword = await pass_hash(password);
        const query = `
            INSERT INTO users (username, email, password, given_name, family_name, dob, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [username, email, hashedPassword, given_name, family_name, dob, role];
        const res = await pool.query(query, values);

        const successMessage = createMessage('User created successfully! ', 'success');
        console.log(successMessage.message);
        return { user: res.rows[0], message: successMessage };
    } catch (error) {
        const errorMessage = createMessage('Oops!   There was a hiccup in creating the user: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to get all users
export const getAllUsers = async () => {
    const query = 'SELECT id, username, email, given_name, family_name, dob, role FROM users';
    try {
        const res = await pool.query(query);
        const successMessage = createMessage('Users fetched successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows;
    } catch (error) {
        const errorMessage = createMessage('Oops!   There was an error fetching users: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to get a user by ID
export const getUserById = async (id) => {
    const query = 'SELECT id, username, email, given_name, family_name, dob, role FROM users WHERE id = $1';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (!res.rows.length) {
            const errorMessage = createMessage('Uh-oh!  We couldn’t find that user. Try again!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('User fetched successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Something went wrong!  Error fetching user: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to get a user by username
export const getUserByUsername = async (username) => {
    const query = 'SELECT id, username, email, password, given_name, family_name, dob, role FROM users WHERE username = $1';
    const values = [username];
    try {
        const res = await pool.query(query, values);
        if (!res.rows.length) {
            const errorMessage = createMessage('Uh-oh!  We couldn’t find that username. Try again!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('User fetched successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows[0]; // Returning the user details
    } catch (error) {
        const errorMessage = createMessage('Something went wrong!  Error fetching user: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error; 
    }
};

// Function to update a user
export const updateUser = async (id, username, email, given_name, family_name, dob, role) => {
    const query = `
        UPDATE users
        SET username = $1, email = $2, given_name = $3, family_name = $4, dob = $5, role = $6
        WHERE id = $7
        RETURNING *
    `;
    const values = [username, email, given_name, family_name, dob, role, id];
    try {
        const res = await pool.query(query, values);
        const successMessage = createMessage('User updated successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops!   There was an error updating the user: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to delete a user
export const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (res.rows.length === 0) {
            const errorMessage = createMessage('Womp womp...  No user found to delete!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('User deleted successfully! ', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops!   There was an error deleting the user: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to validate and update the date of birth
export const validateAndUpdateDob = async (id, dob) => {
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
        const errorMessage = createMessage('Oops!  There was an error updating the date of birth: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Update last logged in time
export const updateLastLoggedIn = async (userId) => {
    const query = `
        UPDATE users 
        SET last_logged_in = NOW() 
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

//====================================//
//passwords hashing and verification//
//=================================//

export const verifyUserPassword = async (email, password) => {
    const user = await getUserByEmail(email);
    if (user && await verifyPassword(password, user.password)) {
        return user;  // Authentication successful
    } else {
        throw new Error('Invalid email or password');
    }
};

// =============================//
// User Authentication Functions//
// =============================//

// Function to retrieve a user from the database by their email address
export const getUserByEmail = async (email) => {
    const query = 'SELECT id, username, email, password, given_name, family_name, dob, role FROM users WHERE email = $1';
    const values = [email];
    try {
        const res = await pool.query(query, values);
        if (!res.rows.length) {
            return null; // No user found
        }
        return res.rows[0];
    } catch (error) {
        console.error('Error fetching user by email:', error.message);
        throw error;
    }
};


//================================//
// User Role Management Functions//
//================================//

// Function to get all users with their roles
const getAllUsersWithRoles = async () => {
    const query = 'SELECT id, username, email, role FROM users';
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (error) {
        console.error('Error fetching users with roles:', error.message);
        throw error;
    }
}
export const updateRole = async (id, newRole) => {
    const query = `
        UPDATE users SET role = $1 WHERE id = $2 RETURNING *
    `;
    const values = [newRole, id];
    try {
        const res = await pool.query(query, values);
        const successMessage = createMessage('User role updated successfully!', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error updating the role: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};
