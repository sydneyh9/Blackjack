//instructions.js

export function initialInstructions() {
    //establish button for dealing the cards
    const button = document.getElementById('deal');
    const instructionsOverlay = document.getElementById('instructions-overlay');
    const closeInstructionsButton = document.getElementById('close-instructions');
    const helpButton = document.getElementById('help-button');

    button.classList.add('centered');
    
    //show the instructions when the page loads
    instructionsOverlay.classList.remove('hidden');

     //hide it when the user clicks the close button
     closeInstructionsButton.addEventListener('click', () => {
        instructionsOverlay.classList.remove('show');
    });

    //toggle instructions with help button
    helpButton.addEventListener('click', () => {
        instructionsOverlay.classList.toggle('show');
    });

        //if the user clicks outside of the instructions, it disappears and goes back to main game
    //if user clicks outside of the settings box, it disappears and goes back to main game
    instructionsOverlay.addEventListener("click", (event) => {
        if (event.target === instructionsOverlay) {
            instructionsOverlay.classList.remove("show");
        }
    });
}