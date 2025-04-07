//server side validation
function validatePasswords() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordRequirements = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password.match(passwordRequirements)) {
        alert("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    return true; // Allow form submission
}
