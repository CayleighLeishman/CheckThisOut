import pool from './db.js';
import bcrypt from 'bcrypt';


// =========================================================================== //
//  Hashes a password using bcrypt with a specified number of "alt rounds.     //
// This function is used to securely store passwords in the database.         //
// ===========================================================================// 
const pass_hash= async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
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
            role VARCHAR(50) DEFAULT 'customer'
        )
    `;
    try {
        await pool.query(query);
        console.log('Users table created successfully or already exists.');
    } catch (error) {
        console.error('Error creating users table:', error);
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
        return res.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Function to get all users
export const getAllUsers = async () => {
    const query = 'SELECT id, username, email, given_name, family_name, dob, role FROM users';
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

// Function to get a user by ID
export const getUserById = async (id) => {
    const query = 'SELECT id, username, email, given_name, family_name, dob, role FROM users WHERE id = $1';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};

// Function to get a user by username
export const getUserByUsername = async (username) => {
    const query = 'SELECT id, username, email, password, given_name, family_name, dob, role FROM users WHERE username = $1';
    const values = [username];
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (error) {
        console.error('Error getting user by username:', error);
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
        return res.rows[0];
    } catch (error) {
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
            return null;
        }
        return res.rows[0];
    } catch (error) {
        console.error('Error deleting user:', error);
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
        return res.rows[0];
    } catch (error) {
        console.error('Error updating date of birth:', error);
        throw error;
    }
};

// Function to verify a password
export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};