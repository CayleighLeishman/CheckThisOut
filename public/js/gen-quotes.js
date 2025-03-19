// gen stands for general quotes, I forgot how to spell generalized, and figured it was too long to type so I just left it as is

// tripple check this works on all required files

// This script generates a random motivational quote and displays it on the logout page
const logoutQuotes = [
    "You’ve closed the book on this session. Hope to see you again soon!",
    "You're checked out! But don’t worry, you can always ‘bookmark’ your return!",
    "The page has turned, but don’t worry—we’re always here when you need a new chapter!",
    "You've hit the end of the story—until next time, keep turning the pages!",
    "This chapter’s over. Come back soon for your next adventure!",
    "Your session has been ‘shelved’—we’ll be here when you’re ready to check back in!",
    "You’ve checked out, but there’s always room for more in our library!",
    "Your session is now overdue—no late fees, just come back whenever you like!",
    "Closing this book... but we’ll keep the door open for your next visit!",
    "You’ve closed your tab, but we hope you’ll check out our other volumes soon!"
];
    
// add another quotes for submission


// Select a random quote and display it
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
const quoteElement = document.createElement('p');
quoteElement.textContent = randomQuote;
document.querySelector('.logout-container').appendChild(quoteElement);