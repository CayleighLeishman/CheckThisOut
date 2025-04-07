import { Router } from 'express';
import { createContactMessage } from '../models/contacts-models.js'; 
import { createMessage } from '../utils/notif.js';

const router = Router();

// Route to handle contact form submission
router.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Assuming you're handling user_id if the user is logged in
        const user_id = req.session.user_id || null; // Use session or other method to get the logged-in user ID

        // Create the contact message in the database
        const newMessage = await createContactMessage(user_id, name, email, message);

        // Return a success message
        const successMessage = createMessage('Your message has been sent successfully!', 'success');
        res.status(200).json({ message: successMessage.message, contactMessage: newMessage });

    } catch (error) {
        // Return an error message if something goes wrong
        const errorMessage = createMessage('An error occurred while sending your message. Please try again later.', 'error');
        res.status(500).json({ message: errorMessage.message });
    }
});

export default router;