import pool from '/index.js';

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
        console.log('Genres table created successfully or already exists.');
    } catch (error) {
        console.error('Error creating genres table:', error);
        throw error;
    }
};

// Function to add a new genre
export const createGenre = async (name) => {
    try {
        const query = 'INSERT INTO genres (name) VALUES ($1) RETURNING *';
        const values = [name.toLowerCase().trim()];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating genre:', error);
        throw error;
    }
};

// Function to get all genres`
export const getGenres = async () => {
    try {
        const result = await pool.query('SELECT * FROM genres');
        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving genres:', error);
        throw error;
    }
};

// Function to get a genre by ID
export const getGenreById = async (id) => {
    try {
        const query = 'SELECT * FROM genres WHERE id = $1';
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving genre:', error);
        throw error;
    }
};


// Function to get a genre by name
export const getGenreByName = async (name) => {
    try {
        const query = 'SELECT * FROM genres WHERE name = $1';
        const values = [name.toLowerCase().trim()];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving genre:', error);
        throw error;
    }
};

// Function to update a genre
export const updateGenre = async (id, name) => {
    try {
        const query = 'UPDATE genres SET name = $1 WHERE id = $2 RETURNING *';
        const values = [name.toLowerCase().trim(), id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating genre:', error);
        throw error;
    }
};
