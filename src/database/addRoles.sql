CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Insert the 'admin' role if it doesn't exist already
INSERT INTO roles (name) 
VALUES ('admin')
ON CONFLICT (name) DO NOTHING;

