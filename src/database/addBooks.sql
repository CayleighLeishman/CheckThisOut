-- Create the books table if it doesn’t already exist
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,  -- Unique ID for each book
    title VARCHAR(255) NOT NULL,  -- Book title (required)
    author VARCHAR(255) NOT NULL,  -- Author's name (required)
    genre_id INTEGER,  -- Links to the genres table
    published_year INTEGER CHECK (published_year > 0),  -- Ensures positive year
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Auto timestamp for record creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Auto timestamp for updates
    CONSTRAINT fk_genre FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL
);

-- Insert sample books (with genre association)
INSERT INTO books (title, author, genre_id, published_year) VALUES
    ('Dune', 'Frank Herbert', (SELECT id FROM genres WHERE name = 'Science Fiction'), 1965),
    ('The Hobbit', 'J.R.R. Tolkien', (SELECT id FROM genres WHERE name = 'Fantasy'), 1937),
    ('Clean Code', 'Robert C. Martin', (SELECT id FROM genres WHERE name = 'Computer'), 2008),
    ('Pride and Prejudice', 'Jane Austen', (SELECT id FROM genres WHERE name = 'Romance'), 1813)
ON CONFLICT DO NOTHING;

-- Verify that books were inserted
SELECT * FROM books;

-- READ: Retrieve all books with their genre names
SELECT books.id, books.title, books.author, genres.name AS genre, books.published_year
FROM books
LEFT JOIN genres ON books.genre_id = genres.id
ORDER BY books.title ASC;

-- READ: Retrieve books of a specific genre (e.g., 'Fantasy')
SELECT books.title, books.author, genres.name AS genre
FROM books
JOIN genres ON books.genre_id = genres.id
WHERE genres.name = 'Fantasy';

-- UPDATE: Change a book’s genre
UPDATE books
SET genre_id = (SELECT id FROM genres WHERE name = 'Action')
WHERE title = 'The Hobbit';

-- DELETE: Remove a book by title
DELETE FROM books WHERE title = 'Pride and Prejudice';

-- DELETE: Remove all books of a specific genre (e.g., 'Computer')
DELETE FROM books
WHERE genre_id = (SELECT id FROM genres WHERE name = 'Computer');
