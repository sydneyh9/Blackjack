//instructions.js

export class InstructionsManager {
    constructor() {
        this.instructionsOverlay = document.getElementById('instructions-overlay');
        this.closeInstructionsButton = document.getElementById('close-instructions');
        this.helpButton = document.getElementById('help-button');
        this.init();
    }
    init() {
        if (!this.instructionsOverlay || !this.closeInstructionsButton || !this.helpButton) return;

        //shows instructions when page loads
        this.instructionsOverlay.style.display = 'flex';

        //hides when close button clicked
        this.closeInstructionsButton.addEventListener('click', () => {
            this.hideInstructions();
        });

        //toggle the instructions when help button clicked
        this.helpButton.addEventListener('click', () => {
            this.toggleInstructions();
        });

        //hide overlay if user clicks outside the box
        this.instructionsOverlay.addEventListener('click', (event) => {
            const instructionsBox = document.querySelector('.instructions-box');
            if (this.instructionsOverlay.style.display === 'flex' && !instructionsBox.contains(event.target)) {
                this.hideInstructions();
            }
        });
    }

    showInstructions() {
        this.instructionsOverlay.style.display = 'flex';
    }

    hideInstructions() {
        this.instructionsOverlay.style.display = 'none';
    }
    
    toggleInstructions() {
        this.instructionsOverlay.style.display = this.instructionsOverlay.style.display === 'flex' ? 'none' : 'flex';
    }
}