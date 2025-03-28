import { Router } from 'express';
// too afraid to delete but can't remember what the propercode is 
// import {
//     addBook,
//     updateBook,
//     deleteBook,
// } from '../../db/books-models.js'; // Adjust path
// import { isAuthenticated } from '../../middleware/auth.js'; // havent added in yet. 
// import pool from '../../db/index.js';

const router = Router();

router.post('/books', isAuthenticated, async (req, res) => {
    const { title, author, publishedDate, genre_id } = req.body;
    const result = await addBook(title, author, publishedDate, genre_id);
    res.json(result);
});

router.put('/books/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, author, publishedDate, genre_id } = req.body;
    const result = await updateBook(id, title, author, publishedDate, genre_id);
    res.json(result);
});

router.delete('/books/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const result = await deleteBook(id);
    res.json(result);
});

router.post('/return-book', isAuthenticated, async (req, res) => {
    const { bookId } = req.body;
    try {
        const query = 'UPDATE books SET available = true, checked_out_by = NULL WHERE id = $1';
        const values = [bookId];
        await pool.query(query, values);
        res.json({ message: "Book returned Successfully" });
    } catch (error) {
        console.error("error returning book", error);
        res.status(500).json({ message: "error returning book" });
    }
});

export default router;