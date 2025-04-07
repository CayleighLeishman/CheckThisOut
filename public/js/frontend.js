// This script facilitates dynamic API interaction, enhancing user experience and separating client-side logic.

// *****************//
//     fetch Users   //
// *****************//

// Function to fetch a user by ID
async function fetchUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const user = await response.json();
        console.log('User data:', user);
        displayUserData(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        displayErrorMessage('Failed to fetch user.');
    }
}

// Function to create a new user (for general use)
async function createUser(userData) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newUser = await response.json();
        console.log('New user created:', newUser);
        displaySuccessMessage('User created successfully.');
    } catch (error) {
        console.error('Error creating user:', error);
        displayErrorMessage('Failed to create user.');
    }
}

// Example functions to display data or messages in the UI
function displayUserData(user) {
    const userDataDiv = document.getElementById('userData');
    if (userDataDiv) {
        userDataDiv.innerHTML = JSON.stringify(user, null, 2);
    }
}

function displayErrorMessage(message) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.color = 'red';
    }
}

function displaySuccessMessage(message) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.color = 'green';
    }
}

// Handle registration form submission
async function handleRegister(event) {
    event.preventDefault();

    const givenName = document.getElementById('given_name').value;
    const familyName = document.getElementById('family_name').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ given_name: givenName, family_name: familyName, dob: dob, email: email, password: password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }

        const newUser = await response.json();
        console.log('User registered:', newUser);
        window.location.href = '/login';
    } catch (error) {
        console.error('Registration error:', error);
        document.getElementById('message').textContent = error.message;
    }
}

// Add event listener to the form
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
});

