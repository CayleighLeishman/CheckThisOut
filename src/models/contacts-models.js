import pool from './index.js';
import { createMessage } from './roles-utils.js';

// Function to create the contacts table
export const createContactsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES "user"(id),
            username VARCHAR(255),
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        const successMessage = createMessage('Contacts table created successfully or already exists!', 'success');
        console.log(successMessage.message);
    } catch (error) {
        const errorMessage = createMessage('Uh-oh! There was an error creating the contacts table: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to create a contact message
export const createContactMessage = async (user_id, username, message) => {
    const query = `
        INSERT INTO contacts (user_id, username, message)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const values = [user_id || null, username, message]; // user_id is null for non-logged-in users
    try {
        const res = await pool.query(query, values);
        const successMessage = createMessage('Message sent successfully!', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error sending the message: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to get all contact messages
export const getAllContactMessages = async () => {
    const query = 'SELECT id, user_id, username, message, created_at FROM contacts';
    try {
        const res = await pool.query(query);
        const successMessage = createMessage('Messages fetched successfully!', 'success');
        console.log(successMessage.message);
        return res.rows;
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error fetching the contact messages: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to get a contact message by ID
export const getContactMessageById = async (id) => {
    const query = 'SELECT id, user_id, username, message, created_at FROM contacts WHERE id = $1';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (!res.rows.length) {
            const errorMessage = createMessage('Uh-oh! We couldn’t find that contact message. Try again!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('Contact message fetched successfully!', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Something went wrong! Error fetching contact message: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Function to delete a contact message
export const deleteContactMessage = async (id) => {
    const query = 'DELETE FROM contacts WHERE id = $1 RETURNING *';
    const values = [id];
    try {
        const res = await pool.query(query, values);
        if (res.rows.length === 0) {
            const errorMessage = createMessage('Womp womp... No message found to delete!', 'error');
            console.log(errorMessage.message);
            return null;
        }
        const successMessage = createMessage('Message deleted successfully!', 'success');
        console.log(successMessage.message);
        return res.rows[0];
    } catch (error) {
        const errorMessage = createMessage('Oops! There was an error deleting the message: ' + error.message, 'error');
        console.error(errorMessage.message);
        throw error;
    }
};

// Route to handle contact form submission
app.post('/contact', async (req, res) => {
    const { user_id, username, message } = req.body;
    try {
        const newMessage = await createContactMessage(user_id, username, message);
        res.status(200).json({ message: 'Your message was sent successfully!', contactMessage: newMessage });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while sending your message.' });
    }
});


