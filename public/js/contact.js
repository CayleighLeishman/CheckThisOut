document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const message = document.querySelector('#message').value;
        
        const data = { name, email, message };
        
        try {
            const response = await fetch('/contacts/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            alert(result.message); // or handle the success message however you like
        } catch (error) {
            alert('Something went wrong. Please try again later.');
        }
    });
});
