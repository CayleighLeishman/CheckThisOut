/**
 * Imports
 */
import express from "express";
import dotenv from 'dotenv';
import path from "path";
import sessions from 'express-session';
import { getNav } from './src/utils/index.js';
import { fileURLToPath } from 'url';
import configNodeEnv from './src/middleware/node-env.js';
import fileUploads from './src/middleware/file-uploads.js';
import homeRoute from './src/routes/index.js';
import bookRoutes from './src/routes/book-routes.js';
import layouts from './src/middleware/layouts.js';
import { configureStaticPaths } from './src/utils/index.js';
import { testDatabase } from './src/models/index.js';
import flash from 'connect-flash'; 

/**
 * Global Variables
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mode = process.env.NODE_ENV;
const port = process.env.PORT;

// Create and configure the Express server
const app = express();

// Configure dotenv to load the .env file
dotenv.config();

// Configure the application based on environment settings
app.use(configNodeEnv);

// Configure static paths (public dirs) for the Express application
configureStaticPaths(app);

// Set EJS as the view engine and record the location of the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set('layout default', 'default');
app.set('layouts', path.join(__dirname, 'src/views/layouts'));
app.use(layouts);

// Middleware to process multipart form data with file uploads
app.use(fileUploads);

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));


/**
 * Sessions
 */
app.use(sessions({
    secret: process.env.SESSION_SECRET || 'in_sessions_something_is_wrong_', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false} //this for testing
}));

//middleware to add flash after session middleware 
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_mesg = req.flash('success_mesg');
    res.locals.error_mesg = req.flash('error_mesg');
    next();
});
// Middleware to serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
//  */
app.use('/', homeRoute);

app.use('/books', bookRoutes);
app.use('/books/:id', bookRoutes);

// gets the registeration page
app.get('/register', (req, res) => {
    res.render('register'); // Make sure this file exists: views/register.ejs (or .html)
});



// Example global error handler in server.js (this should be right below your routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Err 500: Sorry to say this... but Something broke!');
});


/**
 * Start the server
 */

// When in development mode, start a WebSocket server for live reloading
if (mode.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(port) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}
//get the nav for the current request and make it available in res.locals
app.use((req, res, next) => {
    res.locals.nav = getNav(req);
    next();
});

// Start the Express server
app.listen(port, async () => {
    await testDatabase(); //TO DO:: eplace this with the setup instead of test
    console.log(`Server running on http://127.0.0.1:${port}`);
});

console.log(`src/server.js : Node Environment: ${mode}`);
//to do: 
//add books on frontend
// you're missing sessiosn hook that up in server.js

//simplify passwords if bcrypt is hard
//dont use mdfive 
//get it running on render 
//on teams there's a link for "force connect with github 
// //new /web service 
// digit ocean 
// 

// for login. when someone tries to log in or create an account on the login page
// route it to itsself witha flash that says "the account does not exist! Check your password or username
// if a site does not exist, have a page where it loads "whoops! something happened! Please go back to the previous page"