import { Router } from 'express';

const router = Router();
 
/*******************************
 *         Home Page           *
 *******************************/
router.get('/', async (req, res) => {
    res.render('index', { title: 'Home Page' });
});

/*******************************
 *         Login           *
 *******************************/

router.get('/login', async (req,res) =>{
    res.render('login', {title: 'Login Page' });

});

router.post('/login', async (req, res) => {
    // Handle login logic here
});

// logged out
router.post('/logout', async (req, res) => {
    // Handle logout logic here
});

/*******************************
 *         Sign Up            *
 *******************************/
router.get('/signup', async (req, res) => {
    res.render('signup', { title: 'Signup Page' });
});

router.post('/signup', async (req, res) => {
    // Handle signup logic here
});

/*******************************
 *   User Profile/dashboard    *
 *******************************/
router.get('/profile', async (req, res) => {
    res.render('profile', { title: 'User Profile' });
});

router.post('/profile/update', async (req, res) => {
    // Handle profile update
});

router.get('/dashboard', async (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

/*******************************
 *   Contact for Library    *
 *******************************/
router.get('/contact', async (req, res) => {
    res.render('contact', { title: 'Contact' });
});

router.post('/contact', async (req, res) => {
    // Handle contact form submission
});

/*******************************
 *   *If Time:About This Page  *
 *******************************/
router.get('/about', async (req, res) => {
    res.render('about', { title: 'About' });
});

export default router;