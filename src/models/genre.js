import pool from '/index.js';

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

export const getGenres = async () => {
    try {
        const result = await pool.query('SELECT * FROM genres');
        return result.rows;
    } catch (error) {
        console.error('Error retrieving genres:', error);
        throw error;
    }
};
