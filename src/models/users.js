import pool from './db.js';

// Function to create the users table
export const createUsersTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        given_name VARCHAR(100),    -- New column for given name
        family_name VARCHAR(100),   -- New column for family name
        dob DATE                    -- New column for date of birth
    )`;
    try {
        await pool.query(query);
    } 
    catch (error) {
        console.error('Error creating users table:', error);
        throw error;
    }
};

// Function to add a new user
export const createUser = async (username, email, given_name, family_name, dob) => {
    validateDob(dob); // Validate the date of birth before proceeding
    const query = 'INSERT INTO users (username, email, given_name, family_name, dob) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [username, email, given_name, family_name, dob];
    try {
        const res = await pool.query(query, values);
        return res.rows[0]; // Returns the newly created user
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw error;
    };
};

// Function to validate and update the date of birth
export const validateAndUpdateDob = async (id, dob) => {
    // Validate the date of birth
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
        return res.rows[0]; // Returns the updated user
    } catch (error) {
        console.error('Error updating date of birth:', error);
        throw error;
    }
};


// Function to get all users
export const getAllUsers = async () => {
    const query = 'SELECT * FROM users';
    try {
       const res = await pool.query(query);
       return res.rows; // Returns an array of users
    }
    catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

// Function to get a user by ID
export const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];}
    catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};

// Function to update a user
export const updateUser = async (id, username, email, given_name, family_name, dob) => {
    const query = 'UPDATE users SET username = $1, email = $2, given_name = $3, family_name = $4, dob = $5 WHERE id = $6 RETURNING *';
    const values = [username, email, given_name, family_name, dob, id];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    }
    catch (error) {
        console.error('Error updating user:', error);
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
            return null; // Returns null if no user was found
        }
            return res.rows[0]; // Returns the deleted user
    }   
    catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    };
};
