import {createDeck} from './deck.js';

export let cards = [];
export let your_cards = [];
export let dealer_cards = [];
export let playerStay = false;
export let current_score = 0;
export let dealer_score = 0;
export let win_or_lose = "";
export let blackjackState = "start";

//resetting game function for every new round
export function resetGame(isRestart = true) {
    const gameInformation = document.getElementById('game_information');
    if (isRestart) {
        if(gameInformation) gameInformation.style.visibility = 'hidden';
        const scoreBox = document.getElementById('score-box');
    if (scoreBox) scoreBox.style.display = 'none';
    const resultBox = document.getElementById('result-box');
    if (resultBox) resultBox.style.display = 'none';
    const cardLabels = document.querySelectorAll('.card-label');
    cardLabels.forEach(label => {
        label.style.display = 'none';
    });
    }
    cards = createDeck();
    your_cards = [];
    dealer_cards = [];
    first_card = 0;
    second_card = 0;
    dealer_first_card = 0;
    playerStay = false;
    dealerStay = false;
    toggleMusicButton.disabled = true;
    toggleSoundEffectButton.disabled = true;
    updateToggleButtonsGlow();
    dealer_second_card = 0;
    current_score = 0;
    dealer_score = 0;
    win_or_lose = "";
    blackjackState = "start";

    if (yourcards) yourcards.innerHTML = "";
    if (dealercards) dealercards.innerHTML = "";
    if (currentscore) currentscore.textContent = "";
    if (dealerscore) dealerscore.textContent = "";
    if (winorlose) {
        winorlose.textContent = "";
    }
    if (button) {
        button.setAttribute('data-label', 'Deal');
        button.disabled = false;
    }
    if (buttonStay) {
        //stay button should not be available at the start of the game
        buttonStay.disabled = true;
        /*hide stay button when reset */
        buttonStay.style.visibility = 'hidden';
    }
    updateDisplay();
}

