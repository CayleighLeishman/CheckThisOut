import express from 'express';
import path from 'path';
import { getGenres } from '../models/genre-models.js';

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
            registeredPaths.add(pathKey);
            
            if (typeof pathConfig === 'string') {
                // Register the path directly
                app.use(pathConfig, express.static(pathConfig));
            } else {
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

const getNav = async (user) => {
    try {
        console.log("getNav called");
        const genre = await getGenres(); // Fetch genres into 'genre'
        console.log('src/utils/index.js line 62: genre:', genre);

        let nav = '<nav><ul>';

        if (genre && genre.length > 0) {
            genre.forEach(genreItem => { // Use 'genreItem' or 'genre' as the parameter. I will use genreItem to prevent confusion.
                nav += `<li><a href="/genre/${genreItem.id}">${genreItem.genre_name}</a></li>`;
            });
        }

        if (user) {
            nav += `<li><a href="/">Home</a></li>
                    <li>
                        <form action="/logout" method="POST" style="display: inline;">
                            <button type="submit">Logout</button>
                        </form>
                    </li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul></nav>`;
        } else {
            nav += `<li><a href="/">Home</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/register">Sign Up</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul></nav>`;
        }



        console.log('src/utils/index.js line 85: nav:', nav);
        return nav;
    } catch (error) {
        console.error('Error in getNav:', error);
        return '<nav><ul><li>Error generating navigation</li></ul></nav>';
    }
};
// const getNav = () => {
//     return `<nav>
//         <ul>
//             <li><a href="/">Home</a></li>
//             <li><a href="/login">Login</a></li>
//             <li><a href="/profile">Profile</a></li>
//             <li><a href="/dashboard">Dashboard</a></li>
//             <li><a href="/genre"></a>Genre</li> 
//             <li><a href="/contact">Contact</a></li>
//         </ul>
//     </nav>`;
// };
    // When you implement the Database, uncomment this code
// const genre = await getGenres();
// }
// const getNav = async () => {

//     const genre = await getGenres();
//     console.log('src/utils/index.js line 62: genre:', genre);

//     let nav = '<nav><ul>';

//     genre.forEach((genre) => {
//         nav += `<li><a href="/genre/${genre.id}">${genre.title}</a></li>`;
//     });

//     nav += `<nav>
//         <ul>
//             <li><a href="/">Home</a></li>
//             <li><a href="/login">Login</a></li>
//             <li><a href="/signup">Sign Up</a></li>
//             <li><a href="/profile">Profile</a></li>
//             <li><a href="/dashboard">Dashboard</a></li>
//             <li><a href="/genre"></a>Genre</li> 
//             <li><a href="/contact">Contact</a></li>
//         </ul>
//     </nav>`;

//     return `${nav}</ul></nav>`;
// };  
export { configureStaticPaths, getNav };