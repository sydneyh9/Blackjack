//play.js

import { createDeck } from "./deck.js";
import { resetGame, startGame, drawCard, dealerTurn, blackjackState, playerStay } from "./game.js";
import { updateDisplay, startCountDown, showInstructions } from "./ui.js";
import {playButtonSound} from './audio.js';
import './settings.js';

const instructionsOverlay = document.getElementById('instructions-overlay')
const closeInstructionsBtn = document.getElementById('close-instructions');
const dealBtn = document.getElementById("deal");
const stayBtn = document.getElementById("stay");

dealBtn.style.display = "none";
stayBtn.disabled = true;

showInstructions();


closeInstructionsBtn.addEventListener("click", () => {
    instructionsOverlay.style.display = "none";
    dealBtn.style.display = "block";
    stayBtn.disabled = true;
});

dealBtn.addEventListener("click", () => {
    playButtonSound();
    if (blackjackState === "start") {
        //prepare deck
        resetGame(createDeck, () => { dealBtn.style.display = "block";});
        dealBtn.disabled = true;
        stayBtn.disabled = true;
        startCountDown(() => {
            startGame();
            dealBtn.disabled = false;
            stayBtn.disabled = false;
            toggleMusic(true);
    });
    } else if (blackjackState === "in-game") {
        drawCard();
    } else if (blackjackState === "done") {
        resetGame(createDeck, updateDisplay);
        startCountDown(() => startGame());
    }
});

stayBtn.addEventListener("click", () => {
    playButtonSound();
    if (blackjackState === "in-game") {
        playerStay = true;
        dealerTurn();
        stayBtn.disabled = true;
    }
});

resetGame(createDeck, updateDisplay);