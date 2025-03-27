// Function to validate a password
export const validatePassword = (password) => {
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    }
};
