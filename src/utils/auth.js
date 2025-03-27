import bcrypt from 'bcrypt';

// =========================================================================== //
//                                   Passwords                                 //    
// ===========================================================================//




// =========================================================================== //
//  Hashes a password using bcrypt with a specified number of "alt rounds.     //
// This function is used to securely store passwords in the database.         //
// ===========================================================================// 
const pass_hash= async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const registerUser = async (username, email, password, given_name, family_name, dob) => {
    try {
        // Validate password before hashing
        validatePassword(password);

        // Check if the username or email already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );
        if (existingUser.rows.length > 0) {
            throw new Error('Username or email already exists');
        }

        // Hash the password using bcrypt
        const hashedPassword = await pass_hash(password);

        //  Create the new user
        const query = `
            INSERT INTO users (username, email, password, given_name, family_name, dob, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [username, email, hashedPassword, given_name, family_name, dob, 'customer'];
        const res = await pool.query(query, values);

        return res.rows[0];
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Function to verify a password
export const verifyPassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
