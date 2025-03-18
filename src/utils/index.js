import express from 'express';
import path from 'path';

console.log('src/utils/index.js: after imports');
/** @type {Array<{route: string, dir: string}|string>} Static path configurations */
const staticPaths = [
   { route: '/css', dir: 'public/css' },
   { route: '/js', dir: 'public/js' },
   { route: '/images', dir: 'public/images' }
];

/**
 * THIS IS A CUSTOM FUNCTION. This code is specifically needed to support Brother Keers' layout
 * middleware. If you decide not to use Brother Keers' layout middleware, you can remove this and
 * will need to add the normal express.static middleware to your server.js file.
 * 
 * Configures static paths for the given Express application.
 *
 * @param {Object} app - The Express application instance.
 */
const configureStaticPaths = (app) => {
    // Track registered paths
    const registeredPaths = new Set(app.get('staticPaths') || []);
    
    staticPaths.forEach((pathConfig) => {
        const pathKey = typeof pathConfig === 'string' ? pathConfig : pathConfig.route;
       

        if (!registeredPaths.has(pathKey)) {
            console.log('src/utils/index.js line 40: registeredPath: passed');
            registeredPaths.add(pathKey);
            
            if (typeof pathConfig === 'string') {
                console.log('src/utils/index.js if typeof pathConfig === string: passed');
                // Register the path directly
                app.use(pathConfig, express.static(pathConfig));
            } else {
                console.log('src/utils/index.js line 38 else: passed');
                // Register the path with the specified route and directory
                app.use(pathConfig.route, express.static(path.join(process.cwd(), pathConfig.dir)));
            }
        }
    });

    // Update the app settings with the newly registered paths
    app.set('staticPaths', Array.from(registeredPaths));
};

/**
 * Returns the navigation menu.
 *
 * @returns {string} The navigation menu.
 */

console.log('src/utils/index.js: before getNav()');
const getNav = () => {
    console.log('src/utils/index.js: inside getNav()');
    return `<nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign Up</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/genre"></a>Genre</li> 
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>`;
}

export { configureStaticPaths, getNav };