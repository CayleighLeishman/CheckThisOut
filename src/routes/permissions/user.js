import { Router } from 'express';
import { getBookById } from '../../db/books-models.js'; // Adjust path
import { isCustomer, isAuthenticated } from '../../middleware/auth.js'; // Adjust path
import pool from '../../db/index.js';

const router = Router();

router.post('/request-book', isAuthenticated, isCustomer, async (req, res) => {
    const { bookId } = req.body;
    const userId = req.session.userId;

    try {
        const book = await getBookById(bookId);
        if (!book.available) {
            return res.status(400).json({ message: 'Book is already checked out.' });
        }

        const query = 'UPDATE books SET available = false, checked_out_by = $1 WHERE id = $2';
        const values = [userId, bookId];
        await pool.query(query, values);

        res.json({ message: 'Book requested successfully.' });
    } catch (error) {
        console.error('Book request error:', error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

export default router;