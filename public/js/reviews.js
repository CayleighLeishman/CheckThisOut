//this is to a store logic for handling star rating and submitting review
// Select all the stars
const stars = document.querySelectorAll('.star');
const selectedRatingDisplay = document.getElementById('selected-rating');
const submitButton = document.getElementById('submit-review');
const reviewTextArea = document.getElementById('review-comments');

// This variable will store the selected rating
let selectedRating = 0;

// Add click event listeners to all the stars
stars.forEach(star => {
    star.addEventListener('click', (e) => {
        selectedRating = parseInt(e.target.getAttribute('data-value'));
        selectedRatingDisplay.textContent = selectedRating;

        // Highlight the selected stars (or unhighlight)
        stars.forEach(star => {
            if (parseInt(star.getAttribute('data-value')) <= selectedRating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    });
});

// Submit the review when the user clicks the submit button
submitButton.addEventListener('click', () => {
    if (selectedRating === 0) {
        alert('Please select a rating');
        return;
    }

    const reviewText = reviewTextArea.value.trim();

    if (reviewText === '') {
        alert('Please write a review');
        return;
    }

    // Send the review and rating to the backend
    fetch('/submit-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            rating: selectedRating,
            review: reviewText,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Review submitted:', data);
        // Optionally, you can refresh the page or update the UI
    })
    .catch(error => {
        console.error('Error submitting review:', error);
    });
});
