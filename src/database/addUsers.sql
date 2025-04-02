-- SQL script to add users to the database

-- Create: create table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    given_name VARCHAR(255),
    family_name VARCHAR(255),
    dob DATE,
    role_id INTEGER REFERENCES roles(id)
);

-- Insert the admin user and link to the 'admin' role
INSERT INTO users (username, email, password, given_name, family_name, dob, role_id)
VALUES
    ('cayleighl', 'cayleighl@byui.edu', 'E@syTu-gu3ss', 'Cayleigh', 'Leishman', '1998-25-09', 
    (SELECT id FROM roles WHERE name = 'admin'))
-- Prevents duplicate usernames
ON CONFLICT (username) DO NOTHING;  