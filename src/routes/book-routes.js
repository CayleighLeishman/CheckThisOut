import { Router } from 'express';
import {
  addBook,   // Ensure the function name is consistent (not addBooks)
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../models/books-models.js'; 

const router = Router();

// Get all books
router.get('/', async (req, res) => {
  const books = await getBooks();
  res.json(books);
});

// Get a single book
router.get('/:id', async (req, res) => {
  const book = await getBookById(req.params.id);
  res.json(book);
});

// Add a new book
router.post('/', async (req, res) => {
  const { title, author, publishedDate } = req.body;
  const newBook = await addBooks(title, author, publishedDate);
  res.status(201).json(newBook);
});

// Update book
router.put('/:id', async (req, res) => {
  const { title, author, publishedDate } = req.body;
  const updated = await updateBook(req.params.id, title, author, publishedDate);
  res.json(updated);
});

// Delete book
router.delete('/:id', async (req, res) => {
  const deleted = await deleteBook(req.params.id);
  res.json(deleted);
});

export default router;
