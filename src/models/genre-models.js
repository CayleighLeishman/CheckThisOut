import pool from './index.js';

// Function to create a flash message response
const flashMessage = (status, content) => {
    return {
        status: status, // Can be 'success' or 'error'
        message: content
    };
};

// Function to create the genres table
export const createGenresTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS genres (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        )
    `;
    try {
        await pool.query(query);
        return flashMessage('success', 'Genres table created successfully or already exists.');
    } catch (error) {
        console.error('Error creating genres table:', error);
        return flashMessage('error', 'Error creating genres table.');
    }
};

// Function to add a new genre
export const createGenre = async (name) => {
    try {
        const query = 'INSERT INTO genres (name) VALUES ($1) RETURNING *';
        const values = [name.toLowerCase().trim()];
        const result = await pool.query(query, values);
        return flashMessage('success', `Genre '${result.rows[0].name}' created successfully!`);
    } catch (error) {
        console.error('Error creating genre:', error);
        return flashMessage('error', 'Error creating genre.');
    }
};

// Function to get all genres
export const getGenres = async () => {
    try {
        const result = await pool.query('SELECT * FROM genres');
        if (result.rows.length === 0) {
            return flashMessage('error', 'No genres found.');
        }
        return result.rows;
    } catch (error) {
        console.error('Error retrieving genres:', error);
        return flashMessage('error', 'Error retrieving genres.');
    }
};

// Function to get a genre by ID
export const getGenreById = async (id) => {
    try {
        const query = 'SELECT * FROM genres WHERE id = $1';
        const values = [id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return flashMessage('error', `Genre with ID ${id} not found.`);
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving genre:', error);
        return flashMessage('error', 'Error retrieving genre.');
    }
};

// Function to get a genre by name
export const getGenreByName = async (name) => {
    try {
        const query = 'SELECT * FROM genres WHERE name ILIKE $1';
        const values = [name.toLowerCase().trim()];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return flashMessage('error', `Genre '${name}' not found.`);
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving genre:', error);
        return flashMessage('error', 'Error retrieving genre.');
    }
};

// Function to update a genre
export const updateGenre = async (id, name) => {
    try {
        const query = 'UPDATE genres SET name = $1 WHERE id = $2 RETURNING *';
        const values = [name.toLowerCase().trim(), id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return flashMessage('error', `Genre with ID ${id} not found for update.`);
        }
        return flashMessage('success', `Genre '${result.rows[0].name}' updated successfully!`);
    } catch (error) {
        console.error('Error updating genre:', error);
        return flashMessage('error', 'Error updating genre.');
    }
};

// Function to delete a genre
export const deleteGenre = async (id) => {
    try {
        const query = 'DELETE FROM genres WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await pool.query(query, values);
        if (!result.rows[0]) {
            return flashMessage('error', 'Genre not found or already deleted.');
        }
        return flashMessage('success', `Genre '${result.rows[0].name}' has been erased from history!`);
    } catch (error) {
        console.error('Error deleting genre:', error);
        return flashMessage('error', 'Error deleting genre.');
    }
};
