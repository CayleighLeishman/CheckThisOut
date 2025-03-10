import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Define temporary directory for file uploads
const tmpDir = path.join(process.cwd(), 'public/tmp');

// Create upload directory if it doesn't exist
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
}

// Clear temporary directory on server startup
fs.readdirSync(tmpDir).forEach((file) => {
    fs.unlinkSync(path.join(tmpDir, file));
});

/**
 * Express middleware that processes multipart form data with file uploads
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const fileUploads = (req, res, next) => {
    // Skip middleware if request is not multipart form data
    if (!req.is('multipart/form-data')) {
        return next();
    }
  
    // Configure formidable options for file handling
    const form = formidable({
        allowEmptyFiles: true,      // Allow empty file uploads or forms would break
        keepExtensions: true,       // Preserve file extensions
        minFileSize: 0,             // Allow empty files or forms would break
        multiples: true,            // Allow multiple file uploads
        uploadDir: tmpDir           // Directory to store uploaded files
    });
    
    // Parse the multipart form data
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        // Normalize single-item arrays to scalar values in fields
        for (const key in fields) {
            if (Array.isArray(fields[key]) && fields[key].length === 1) {
                fields[key] = fields[key][0];
            }
        }

        // Remove empty file fields from files object and cleanup temp files
        for (const key in files) {
            const fileData = files[key];
            if (Array.isArray(fileData)) {
                files[key] = fileData.filter(data => {
                    if (data.size === 0) {
                        fs.unlinkSync(data.filepath);
                        return false;
                    }
                    return true;
                });
            } else {
                if (fileData.size === 0) {
                    fs.unlinkSync(fileData.filepath);
                    files[key] = [];
                } else {
                    files[key] = [fileData];
                }
            }
        }
    
        // Attach parsed data to request object
        req.body = fields;
        req.files = files;
        next();
    });
};

export default fileUploads;