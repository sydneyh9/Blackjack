//display.js

import {blackjackState, your_cards, dealer_cards, current_score, dealer_score, win_or_lose, calculateScore} from './game.js';

const yourcardsElement = document.getElementById('your_cards');
const currentscoreElement = document.getElementById('current_score');
const dealercardsElement = document.getElementById('dealer_cards');
const dealerscoreElement = document.getElementById('dealer_score');
const winorloseElement = document.getElementById('win_or_lose');
const turnElement = document.getElementById('turn');
const countdownElement = document.getElementById('countdown');

export function endRound(message) {
    winorloseElement.textContent = message;
}

export function startCountDown(startGame) {
    let timeLeft = 3;
    countdownElement.textContent = `${timeLeft}`;
    countdownElement.style.visibility = 'visible';
    countdownElement.style.opacity = '0.6';
    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            countdownElement.textContent = `${timeLeft}`;
        } else {
            clearInterval(timer);
            countdownElement.textContent = "Let's play!";
            setTimeout(() => {
                countdownElement.style.visibility = 'hidden';
                startGame();
            }, 1000);
        }
    }, 1000);
}

export function updateDisplay(showDealer = false) {
    currentscoreElement.textContent = `Current Score: ${calculateScore(your_cards)}`;
    if (showDealer) {
        dealerscoreElement.textContent = `Dealer's Score: ${calculateScore(dealer_cards)}`;
    }
    winorloseElement.textContent = win_or_lose || '';
    turnElement.textContent = (blackjackState === "in-game") ? "Your turn." : (blackjackState === "dealer-turn") ? "Dealer's turn." : (blackjackState === "done") ? "Game over." : "";
}
