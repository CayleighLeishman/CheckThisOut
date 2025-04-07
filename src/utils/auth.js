import argon2 from 'argon2';
import  pool from '../models/index.js'; 

// =========================================================================== //
//                                    Passwords                                 //
// ===========================================================================//

// Hashes a password using argon2
 export const pass_hash = async (password) => {
    return await argon2.hash(password); // Hash the password using argon2
};

// Function to verify a password
export const verifyPassword = (password, hashedPassword) => {
    return argon2.verify(hashedPassword, password); // Verifies the password with the hash
};

// =========================================================================== //
//                                   User Registration                        //
// ===========================================================================//

// Registers a new user and hashes their password
export const registerUser = async (username, email, password, given_name, family_name, dob) => {
    try {
        // Check if the username or email already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('Username or email already exists');
        }

        // Hash the password using argon2
        const hashedPassword = await pass_hash(password);

        // Create the new user in the database
        const query = `
            INSERT INTO users (username, email, password, given_name, family_name, dob, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [username, email, hashedPassword, given_name, family_name, dob, 'customer'];
        const res = await pool.query(query, values);

        return res.rows[0]; // Return the newly registered user
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};
