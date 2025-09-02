//settings.js

const settingsButton = document.getElementById('settings-button');
const settingsOverlay = document.getElementById('settings-overlay');
const instructionsOverlay = document.getElementById('instructions-overlay');
const closeInstructionsButton = document.getElementById('close-instructions');
const helpButton = document.getElementById('help-button');

settingsButton.addEventListener('click', () => {
    settingsOverlay.classList.toggle('show');
});

closeInstructionsButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
});

helpButton.addEventListener('click', () => {
    instructionsOverlay.style.display = instructionsOverlay.style.display === "flex" ? "none" : "flex";
});

settingsOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'settings-overlay') {
        settingsOverlay.classList.remove('show');
    }
});