import argon2 from 'argon2';

async function testHashing() {
    const password = 'mysecurepassword';
    
    // Hash the password
    const hashedPassword = await argon2.hash(password);
    console.log('Hashed Password:', hashedPassword);

    // Verify the password
    const isValid = await argon2.verify(hashedPassword, password);
    console.log('Password is valid:', isValid);
}

export const authenticate = (req, res, next) => {
    if (!req.session.user) {  // check if the user object is set in the session
        return res.status(401).send('Unauthorized: you\'re not logged in, silly!');
    }

    next(); // Proceed to the next middleware or route handler
};

console.log("src/middleware/authenticate.js")