import session from "express-session";


// Helper function to generate messages
export const createMessage = (type = 'info', content) => {
    // Predefined message types with playful responses
    const playfulMessages = {
        success: [
            'Success achieved! Your task is complete!',
            'Great work! Your task was executed flawlessly!',
            'Congratulations! Your efforts have paid off!',
            'Mission accomplished! The task has been completed successfully!'
        ],
        error: [
            'Apologies, something went wrong... We’ll resolve this promptly!',
            'Uh-oh! There was an unexpected issue, but we’ll sort it out soon!',
            'Unfortunately, an error occurred. We’re working on it!',
            'There seems to be a problem... but we’ll fix it in no time!'
        ],
        info: ['Just a quick update. Everything is moving along smoothly.'],
        warning: ['Attention required! Please check the details to proceed.']
    };
 
    // Ensure the type is valid
    const allowedTypes = ['info', 'success', 'error', 'warning'];
    if (!allowedTypes.includes(type)) {
        type = 'info';  // Default to 'info' if the type is invalid
    }
 
    // If content is not passed in, select a playful message from the predefined set
    const message = content || playfulMessages[type][Math.floor(Math.random() * playfulMessages[type].length)];
 
    // Return the message with a timestamp
    return {
        message,
        type,  // 'info', 'success', 'error', or 'warning'
        timestamp: new Date().toISOString()  // Timestamp to help track when the message was created
    };
 };
 

//  as of April 6 used in
//src/models/Users-models.js
//src/models/contacts-models.js

 // Function to create a flash message response
export const flashMessage = (status, content) => {
    return {
        status: status, // Can be 'success' or 'error'
        message: content
    };
};

//used in src/model/genre
//genre-model
