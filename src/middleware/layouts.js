import { renderFile } from 'ejs';
import path from 'path';

/**
 * Middleware to automatically wrap EJS views in a layout.
 * This replicates `express-ejs-layouts` behavior in pure EJS.
 */
const layouts = (req, res, next) => {
    // Retrieve configuration from Express settings
    const layoutDir = req.app.get('layouts') || path.join(process.cwd(), 'views/layouts');
    const defaultLayout = req.app.get('layout default')?.replace(/\.ejs$/, '') || 'default';

    // Save the original res.render method for later use
    const originalRender = res.render;
    
    // Override `res.render()` to apply layouts automatically.
    res.render = (view, options = {}, callback) => {
         // Merge res.locals with options
        const mergedOptions = {...res.locals, ...options};
    
        // If layout is explicitly set to `false`, render the view normally without a layout
        if (mergedOptions.layout === false) {
            return originalRender.call(res, view, mergedOptions, callback);
        }

        // Resolve the full path of the requested view
        const viewsDir = res.app.get('views');
        const viewPath = view.startsWith(viewsDir) ? view : path.join(viewsDir, `${view}.ejs`);

        // First, render the requested view to get its content
        renderFile(viewPath, mergedOptions , (err, body) => {
            if (err) {
                return next(err);
            }

            // Store the rendered content in `options.body`, so the layout can use it
            mergedOptions.body = body || '';

            // Determine which layout to use (default layout or a custom one if specified)
            const layoutFile = `${mergedOptions.layout || defaultLayout}.ejs`;
            const layoutPath = path.join(layoutDir, layoutFile);

            // Render the selected layout, passing the rendered view content
            originalRender.call(res, layoutPath, mergedOptions, callback);
        });
    };

    // Protect from a layout loop by ensuring `next()` is called only once
    if (!res.headersSent) {
        next();
    }
};

export default layouts;
