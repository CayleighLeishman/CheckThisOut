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
    } catch (error) {
        console.error('Error creating books table:', error);
    }
};

// Helper function to generate messages because I got tired and lazy of repeating the same thing
const createMessage = (type, content) => {
    return { type, content };
};

// Function to add books
const addBook = async (title, author, publishedDate) => {
    const query = `
        INSERT INTO books (title, author, published_date)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [title, author, publishedDate];

    try {
        const result = await pool.query(query, values);
        console.log('Book added:', result.rows[0]);
        return createMessage('success', `Hooray! The pages of '${result.rows[0].title}' by ${result.rows[0].author} are now part of our library!`);
    } catch (error) {
        console.error('Error adding book:', error);
        return createMessage('error', `Oops! Something went wrong while adding the book. Let’s give it another shot.`);
    }
};

// Function to update books
const updateBook = async (id, title, author, publishedDate) => {
    const query = `
        UPDATE books
        SET title = $1, author = $2, published_date = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *;
    `;
    const values = [title, author, publishedDate, id];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            console.log('Book updated:', result.rows[0]);
            return createMessage('success', `Ta-da! '${result.rows[0].title}' by ${result.rows[0].author} is updated and ready for a fresh read!`);
        } else {
            return createMessage('error', 'Oops! We couldn’t find the book to update.');
        }
    } catch (error) {
        console.error('Error updating book:', error);
        return createMessage('error', 'Oh snap! The book update didn’t go as planned. Let’s try again!');
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
        if (result.rows.length > 0) {
            const deletedBook = result.rows[0];
            return createMessage('success', `Bam! '${deletedBook.title}' by ${deletedBook.author} has been erased from history! (Hasta La Vista!)`);
        } else {
            return createMessage('error', 'Oops! We couldn’t find the book to delete!');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        return createMessage('error', 'Uh-oh! The book didn’t want to leave just yet. There was an error while deleting it.');
    }
};

// Function to get all books
const getBooks = async () => {
    const query = 'SELECT * FROM books';

    try {
        const result = await pool.query(query);
        console.log(`Got the books!`, result.rows);
        return result.rows;
    } catch (error) {
        console.error(`Books disappeared! Error:`, error);
        return createMessage('error', 'Oops! Looks like the books went missing.');
    }
};

// Function to get a book by ID
const getBookById = async (id) => {
    const query = 'SELECT * FROM books WHERE id = $1';
    const values = [id];

    try {
        const result = await pool.query(query, values);
        console.log('Got the book:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting book:', error);
        return createMessage('error', 'Oops! We couldn’t find the book with that ID!');
    }
};

// Function to get books by author
const getBooksByAuthor = async (author) => {
    const query = 'SELECT * FROM books WHERE author = $1';
    const values = [author];

    try {
        const result = await pool.query(query, values);
        console.log('Got the books by author:', result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error getting books:', error);
        return createMessage('error', 'Oops! We couldn’t find any books by that author!');
    }
};

// Function to get books by title
const getBooksByTitle = async (title) => {
    const query = 'SELECT * FROM books WHERE title = $1';
    const values = [title];

    try {
        const result = await pool.query(query, values);
        console.log('Got the books by title:', result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error getting books:', error);
        return createMessage('error', 'Oops! We couldn’t find any books with that title!');
    }
};

// Function to get books by published date
const getBooksByPublishedDate = async (publishedDate) => {
    const query = 'SELECT * FROM books WHERE published_date = $1';
    const values = [publishedDate];

    try {
        const result = await pool.query(query, values);
        console.log('Got the books by published date:', result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error getting books:', error);
        return createMessage('error', 'Oops! We couldn’t find any books with that published date!');
    }
};

// Function to get books by created date
const getBooksByCreatedDate = async (createdAt) => {
    const query = 'SELECT * FROM books WHERE created_at = $1';
    const values = [createdAt];

    try {
        const result = await pool.query(query, values);
        console.log('Got the books by created date:', result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error getting books:', error);
        return createMessage('error', 'Oops! We couldn’t find any books with that created date!');
    }
};

export {
    createBooksTable,
    addBook,
    updateBook,
    deleteBook,
    getBooks,
    getBookById,
    getBooksByAuthor,
    getBooksByTitle,
    getBooksByPublishedDate,
    getBooksByCreatedDate
  };
