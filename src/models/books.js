import pool from './index.js';

// Function to create the books table
const createBooksTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            published_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('Books table created successfully.');
    } catch (err) {
        console.error('Error creating books table:', err);
    } finally {
        pool.end();
    }
};

// Function to add books
const addBook = async (title, author, publishedDate) => {
    const query = `
        INSERT INTO books (title, author, published_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [title, author, publishedDate];

    try {
        const result = await pool.query(query, values);
        console.log('Book added:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error adding book:', err);
    }
};

// Function to update books table
const updateBook = async (id, title, author, publishedDate) => {
    const query = `
        UPDATE books
        SET title = $1, author = $2, published_date = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *;
    `;
    const values = [id, title, author, publishedDate];

    try {
        const result = await pool.query(query, values);
        console.log('Book updated:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating book:', err);
    }
};

// Function to delete books

const deleteBook = async (id) => {
    const query = `
        DELETE FROM books
        WHERE id = $1
        RETURNING *;
    `;
    const values = [id];

    try {
        const result = await pool.query(query, values);
        console.log('Book deleted:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error deleting book:', err);
    }
};

// Function to get all books
const getBooks = async () => {
    const query = 'SELECT * FROM books';

    try {
        const result = await pool.query(query);
        console.log('Books retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error getting books:', err);
    }
};

// Function to get a book by ID
const getBookById = async (id) => {
    const query = 'SELECT * FROM books WHERE id = $1';
    const values = [id];

    try {
        const result = await pool.query(query, values);
        console.log('Book retrieved:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error getting book:', err);
    }
};

// Function to get books by author
const getBooksByAuthor = async (author) => {
    const query = 'SELECT * FROM books WHERE author = $1';
    const values = [author];

    try {
        const result = await pool.query(query, values);
        console.log('Books retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error getting books:', err);
    }
};

// Function to get books by title
const getBooksByTitle = async (title) => {
    const query = 'SELECT * FROM books WHERE title = $1';
    const values = [title];

    try {
        const result = await pool.query(query, values);
        console.log('Books retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error getting books:', err);
    }
};

// Function to get books by published date
const getBooksByPublishedDate = async (publishedDate) => {
    const query = 'SELECT * FROM books WHERE published_date = $1';
    const values = [publishedDate];

    try {
        const result = await pool.query(query, values);
        console.log('Books retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error getting books:', err);
    }
};

// Function to get books by created date
const getBooksByCreatedDate = async (createdAt) => {
    const query = 'SELECT * FROM books WHERE created_at = $1';
    const values = [createdAt];

    try {
        const result = await pool.query(query, values);
        console.log('Books retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error getting books:', err);
    }
};

createBooksTable();
