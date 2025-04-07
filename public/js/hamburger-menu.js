// Hamburger Menu
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById("hamburger-button");
    const navList = document.querySelector("nav ul");

    if (menuButton && navList) {
        menuButton.addEventListener('click', () => {
            navList.classList.toggle("open");
        });
    } else {
        console.error("Hamburger button or nav list not found.");
    }
});
