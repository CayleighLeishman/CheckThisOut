import { Router } from 'express';
import argon2 from 'argon2'; 
import {getUserByEmail }from '../models/users-models.js'
import { createMessage, flashMessage } from '../utils/notif.js';

const router = Router();
 
/*******************************
 * Home Page          *
 *******************************/
router.get('/', async (req, res) => {
    const flash = req.session.flash; // Retrieve flash message from session
    delete req.session.flash; // Clear flash message after it's displayed
    res.render('index', { title: 'Home Page', flash });
});

/*******************************
 * Login             *
 *******************************/
router.get('/login', async (req, res) => {

    // Get flash messages
    const error = req.session.error;
    const success = req.session.success;

    // Delete flash messages
    delete req.session.error;
    delete req.session.success;

    res.render('login', {
         title: 'Login Page', 
         error,
         success,
         error_mesg: undefined
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("src/routes/index : before the try/catch")
    try {
        // Retrieve user from database by email
        const user = await getUserByEmail(email); // Replace this with your DB query logic
        
        if (user && await argon2.verify(user.password, password)) {
            // Password is correct, set the session and redirect
            req.session.user = user;
            req.session.success = "Logged in successfully!";
            res.redirect('/dashboard');  // Redirect to a dashboard or home page
        } else {
            // Incorrect password or email
            req.session.error = "Incorrect email or password";
            res.redirect('/login');
        }
    } catch (error) {
        console.error("Login error:", error);
        req.session.error = `Something went wrong with login: ${error}`;
        res.redirect('/login');
    }
});


// logged out
router.post('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.redirect('/dashboard');
        }
        // Clear the session cookie and redirects
        res.clearCookie('connect.sid');
        const successMessage = createMessage('success', 'Successfully logged out.');
        req.session.flash = flashMessage('success', successMessage.message);
        res.redirect('/');
    });
});

/*******************************
 *         REGISTERATION     *
 *******************************/

//see the registration page
router.get('/register', async (req, res) => {
    res.render('register', { 
        title: 'Signup Page',
        error_mesg: undefined, 
        success_mesg: undefined 
    });
});

// Handle registration post
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Hash password with argon2
        const hashedPassword = await argon2.hash(password);
        console.log(`Registered user: ${username}`);
        
        // Placeholder: save user to database logic (example)
        
        // Flash success message
        const successMessage = createMessage('success', 'Registration successful! Please login.');
        req.session.flash = flashMessage('success', successMessage.message);
        
        res.redirect('/login');
    } catch (error) {
        console.error("Registration error: ", error);
        
        // Flash error message
        const errorMessage = createMessage('error', 'An error occurred during registration. Please try again.');
        req.session.flash = flashMessage('error', errorMessage.message);
        
        res.redirect('/register');
    }
});

/*******************************
 * User Profile Or Dashboard   *
 *******************************/
router.get('/profile', async (req, res) => {
    const flash = req.session.flash;
    delete req.session.flash;
    res.render('profile', { title: 'User Profile', flash });
});

router.post('/profile/update', async (req, res) => {
    const { name, bio } = req.body;
    const user = req.session.user;
    if (!user) {
        req.session.error = "Please login to update your profile";
        return res.redirect('/login');
    }
    try {
        // Update user details in the database (replace with your actual update logic)
        console.log(`Updating profile for ${user.email}: Name: ${name}, Bio: ${bio}`);
        await updateUser(user.email, name, bio);
        req.session.success = "Profile updated successfully!";
        
        // Flash success message
        const successMessage = createMessage('success', 'Profile updated successfully!');
        req.session.flash = flashMessage('success', successMessage.message);
        
        res.redirect('/profile');
    } catch (error) {
        console.error("Profile update error: ", error);
        req.session.error = "Error updating profile.";
        
        // Flash error message
        const errorMessage = createMessage('error', 'There was an error updating your profile.');
        req.session.flash = flashMessage('error', errorMessage.message);
        
        res.redirect('/profile');
    }
});

router.get('/dashboard', async (req, res) => {
    const flash = req.session.flash;
    delete req.session.flash;
    res.render('dashboard', { title: 'Dashboard', flash });
});

/*******************************
 * Contact for Library      *
 *******************************/
//contact page get route
router.get('/contact', async (req, res) => {
    const flash = req.session.flash; // Retrieve the flash message from the session
    delete req.session.flash; // Clear the flash message after it's displayed

    res.render('contact', { 
        title: 'Contact', 
        flash // Pass the flash message to the template
    });
});

// Handle contact form submission
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    try {
        // Placeholder for actual email or database logic (e.g., sending an email)
        console.log(`Contact form submitted by ${name} (${email}): ${message}`);
        
        // You can use createMessage to generate a success message if needed
        const successMessage = createMessage('success', 'Your message has been sent successfully!');
        
        // Flash success message using flashMessage
        req.session.flash = flashMessage('success', successMessage.message);

        // Redirect the user back to the contact page with the flash message
        res.redirect('/contact');
    } catch (error) {
        console.error("Error processing contact form:", error);

        // You can use createMessage to generate an error message if something goes wrong
        const errorMessage = createMessage('error', 'Oops! Something went wrong. Please try again.');

        // Flash error message using flashMessage
        req.session.flash = flashMessage('error', errorMessage.message);

        // Redirect back to the contact page with the error message
        res.redirect('/contact');
    }
});

/*******************************
 * *If Time:About This Page   *
 *******************************/
router.get('/about', async (req, res) => {
    const flash = req.session.flash;
    delete req.session.flash;
    res.render('about', { title: 'About', flash });
});

export default router;
