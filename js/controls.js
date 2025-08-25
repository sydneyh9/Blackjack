import {drawCard, resetGame, startCountdown} from './gameEvents.js';
import { blackjackState} from './gameState.js';

//function for the deal button click
export function onButtonClick() {
    //if the sound effects are enabled, fun wheel spin sound for buttons
    if (soundEffectEnabled) {
        buttonSound.play().catch(err => {
            console.log("Failed to play button sound:", err);
        });
    }
    //fun spin animation for when buttons are clicked
    button.classList.add('spin');
    button.addEventListener('animationend', () => {
        button.classList.remove('spin');
    }, { once: true });

    if(blackjackState === "start") {
        startCountDown();
    } else if (blackjackState === "in-game") {
        drawCard();
    } else if (blackjackState === "done") {
        resetGame(true);
        startCountDown();
    }
}

//function for the player to have a stay option
export function onStayClick() {
    //if sound effects enabled, fun wheel spin sound for buttons
    if (soundEffectEnabled) {
        buttonSound.play().catch(err => {
            console.log("Failed to play button sound:", err);
        });
    }
    //fun spin animation for when buttons are clicked
    buttonStay.classList.add('spin');
    buttonStay.addEventListener('animationend', () => {
        buttonStay.classList.remove('spin');
    }, { once: true });
    if (blackjackState === "in-game") {
        playerStay = true;
        dealerTurn();
    }
}

//function for the player clicking settings
export function onSettingsClick() {
    settingsButton.classList.add('spin');
    settingsButton.addEventListener('animationend', () => {
        settingsButton.classList.remove('spin');
    }, { once: true});
}