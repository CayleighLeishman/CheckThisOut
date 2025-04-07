import { Router } from 'express';
import argon2 from 'argon2'; // Import argon2
const router = Router();
 
/*******************************
 * Home Page          *
 *******************************/
router.get('/', async (req, res) => {
    console.log('src/routes/index.js home page:line 8');
    res.render('index', { title: 'Home Page' });
});

/*******************************
 * Login             *
 *******************************/
router.get('/login', async (req, res) => {
    console.log('src/routes/index.js login page:line 16');
    res.render('login', { title: 'Login Page' });
});

// logged out
router.post('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.redirect('/'); //to do/TO DO: this was previously /dashboard, i removed it because dashboard dosen't work properly
        }
        // Clear the session cookie and redirects
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

/*******************************
 *          REGISTERATION     *
 *******************************/

//see the registration page
router.get('/register', async (req, res) => {
    res.render('register', { title: 'Signup Page' });
});



/*******************************
 * User Profile Or Dashboard   *
 *******************************/
router.get('/profile', async (req, res) => {
    res.render('profile', { title: 'User Profile' });
});

router.post('/profile/update', async (req, res) => {
    const { name, bio } = req.body;

    // Example: Fetch user from session and update DB
    const user = req.session.user;
    if (!user) return res.redirect('/login');

    // Update user details in the database (placeholder logic)
    console.log(`Updating profile for ${user.email}: Name: ${name}, Bio: ${bio}`);

    res.redirect('/profile');
});

router.get('/dashboard', async (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

/*******************************
 * Contact for Library      *
 *******************************/
router.get('/contact', async (req, res) => {
    res.render('contact', { title: 'Contact' });
});

// Handle contact form submission
router.post('/contact', async (req, res) => {
    // Handle contact form submission
    const { name, email, message } = req.body;
    console.log(`Contact form submitted by ${name} (${email}): ${message}`);
    // Send email or save to DB (placeholder logic)
    res.redirect('/contact');
});

/*******************************
 * *If Time:About This Page   *
 *******************************/
router.get('/about', async (req, res) => {
    res.render('about', { title: 'About' });
});

export default router;