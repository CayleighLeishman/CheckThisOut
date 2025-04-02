-- Create the genres table if it doesn’t already exist
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,  -- Automatically increments ID for each new entry
    name VARCHAR(100) UNIQUE NOT NULL  -- Genre name must be unique and cannot be NULL
);


INSERT INTO genres (name) VALUES
    ('Action'),
    ('Science Fiction'),
    ('Computer'),
    ('Fantasy'),
    ('Romance')
-- If a genre with the same 'name' already exists, this prevents duplicate entries  
-- Instead of causing an error, the statement will simply skip inserting that row  
ON CONFLICT (name) DO NOTHING;  

-- Verify that genres were inserted
SELECT * FROM genres;

-- Create the genres table if it doesn’t already exist
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,  -- Automatically increments ID for each new entry
    name VARCHAR(100) UNIQUE NOT NULL  -- Genre name must be unique and cannot be NULL
);

-- Insert sample genres (will not insert duplicates)
INSERT INTO genres (name) VALUES
    ('Action'),
    ('Science Fiction'),
    ('Computer'),
    ('Fantasy'),
    ('Romance')
-- If a genre with the same 'name' already exists, this prevents duplicate entries  
-- Instead of causing an error, the statement will simply skip inserting that row  
ON CONFLICT (name) DO NOTHING;  

-- Verify that genres were inserted
SELECT * FROM genres;

-- READ: Retrieve all genres
SELECT * FROM genres ORDER BY name ASC;

-- READ: Retrieve a single genre by ID
SELECT * FROM genres WHERE id = 1;

-- READ: Retrieve a single genre by name (case-insensitive search)
SELECT * FROM genres WHERE LOWER(name) = LOWER('Fantasy');

-- UPDATE: Change the name of a genre
UPDATE genres 
SET name = 'Sci-Fi' 
WHERE name = 'Science Fiction';

-- DELETE: Remove a genre by name
DELETE FROM genres WHERE name = 'Romance';

-- DELETE: Remove a genre by ID
DELETE FROM genres WHERE id = 5;

