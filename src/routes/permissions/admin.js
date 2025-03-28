import { Router } from 'express';
// I cannot remmeber how to create file names but im too afriad to delete this outright. 
// import {
//     createGenre,
//     getGenres,
//     updateGenre,
//     deleteGenre,
// } from '..src/models/genre-models.js'; // not sure if this is the correct path, adjust as needed
//     addBook,
//     updateBook,
//     deleteBook,
// } from '..src/models/books-models.js'; // not sure if this is the correct path, adjust as needed
// import { isAdmin, isAuthenticated } from '...src/j'; // gemeni suggested this path for middleware, but hasn't been implemented yet 

const router = Router();

router.post('/genres', isAuthenticated, isAdmin, async (req, res) => {
    const { name } = req.body;
    const result = await createGenre(name);
    res.json(result);
});

router.get('/genres', isAuthenticated, isAdmin, async (req, res) => {
    const genres = await getGenres();
    res.json(genres);
});

router.put('/genres/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await updateGenre(id, name);
    res.json(result);
});

router.delete('/genres/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;
    const result = await deleteGenre(id);
    res.json(result);
});

router.post('/books', isAuthenticated, isAdmin, async (req, res) => {
    const { title, author, publishedDate, genre_id } = req.body;
    const result = await addBook(title, author, publishedDate, genre_id);
    res.json(result);
});

router.put('/books/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, author, publishedDate, genre_id } = req.body;
    const result = await updateBook(id, title, author, publishedDate, genre_id);
    res.json(result);
});

router.delete('/books/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { id } = req.params;
    const result = await deleteBook(id);
    res.json(result);
});

export default router;