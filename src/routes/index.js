import { Router } from 'express';
import bcrypt from 'bcrypt';
const router = Router();
 
/*******************************
 *         Home Page           *
 *******************************/
router.get('/', async (req, res) => {
    console.log('src/routes/index.js home page:line 8');
    res.render('index', { title: 'Home Page' });
});

/*******************************
 *         Login           *
 *******************************/
router.get('/login', async (req,res) =>{
    console.log('src/routes/index.js login page:line 16');
    res.render('login', {title: 'Login Page' });
});

router.post('/login', async (req, res) => {
    
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email); // Fetch user from DB

        if (!user) {
            return res.status(401).send('User not found.');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Incorrect password.');
        }

        // Store user info in session
        req.session.user = { id: user.id, email: user.email };
        
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
});

// logged out
router.post('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (err) {
            return res.redirect('/dashboard');
        }
        // Clear the session cookie and redirects
        res.clearCookie('connect.sid'); 
        res.redirect('/');
    });
});

/*******************************
 *         Sign Up            *
 *******************************/
router.get('/signup', async (req, res) => {
    res.render('signup', { title: 'Signup Page' });
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Example: Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user to DB (replace with actual DB logic)
    const newUser = { email, password: hashedPassword };
    
    // Redirect or render error
    res.redirect('/login');
});


/*******************************
 *   User Profile Or Dashboard    *
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
 *   Contact for Library    *
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
 *   *If Time:About This Page  *
 *******************************/
router.get('/about', async (req, res) => {
    res.render('about', { title: 'About' });
});

export default router;