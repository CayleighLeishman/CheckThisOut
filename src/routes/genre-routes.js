import express from 'express';
import { getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre } from '../models/genre-models.js'; // Import your model functions
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const genres = await getAllGenres();
        res.render('genres', { genres: genres, title: 'Genres' }); // Render an EJS view
    } catch (error) {
        console.error('Error getting genres:', error);
        res.status(500).send('Internal Server Error');
    }
});

// gets a specific genre
router.get('/:id', async (req, res) => {
    try {
        const genre = await getGenreById(req.params.id);
        if (!genre) {
            req.flash('error', 'Genre not found'); // Add flash message
            return res.redirect('/genres');
        }
        res.render('genre', { genre: genre, title: genre.genre_name, flash: req.flash() }); // Pass flash messages
    } catch (error) {
        console.error('Error getting genre:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const newGenre = await createGenre(req.body);
        req.flash('success', 'Genre created successfully'); // Add flash message
        res.redirect('/genres');
    } catch (error) {
        console.error('Error creating genre:', error);
        req.flash('error', 'Failed to create genre'); // Add flash message
        res.redirect('/genres');
    }
});

router.put('/:id', async (req, res) => {
    try {
        await updateGenre(req.params.id, req.body);
        req.flash('success', 'Genre updated successfully'); // Add flash message
        res.redirect('/genres');
    } catch (error) {
        console.error('Error updating genre:', error);
        req.flash('error', 'Failed to update genre'); // Add flash message
        res.redirect('/genres');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteGenre(req.params.id);
        req.flash('success', 'Genre deleted successfully'); // Add flash message
        res.redirect('/genres');
    } catch (error) {
        console.error('Error deleting genre:', error);
        req.flash('error', 'Failed to delete genre'); // Add flash message
        res.redirect('/genres');
    }
});