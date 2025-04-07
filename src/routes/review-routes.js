import express from 'express';
import dbClient from './models/index'; // Ensure to import your database client
const router = express.express();

// Middleware to parse incoming JSON requests
router.use(express.json());

// POST route to handle review submission
router.post('/submit-review', async (req, res) => {
    const { rating, review, book_id } = req.body;

    // Validate rating and review
    if (rating < 1 || rating > 5 || !review || !book_id) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        // Insert the review and rating into the database
        const result = await dbClient.query(
            'INSERT INTO reviews (user_id, vehicle_id, rating, comments) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, req.body.vehicle_id, rating, review] // Replace req.user.id and vehicle_id with real data
        );
        res.json({ message: 'Review submitted successfully', review: result.rows[0] });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const ensureAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }
    next();
};

// Use this middleware for protected routes
router.post('/submit-review', ensureAuthenticated, async (req, res) => {
    const { rating, review } = req.body;
    // Review logic...
});
