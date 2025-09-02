//play.js

import { createDeck } from "./deck.js";
import { resetGame, drawCard, dealerTurn, blackjackState, playerStay } from "./game.js";
import { updateDisplay, startCountDown } from "./ui.js";
import {playButtonSound} from './audio.js';
import './settings.js';

const dealBtn = document.getElementById("deal");
const stayBtn = document.getElementById("stay");

dealBtn.addEventListener("click", () => {
    playButtonSound();
    if (blackjackState === "start") {
        startCountDown(() => resetGame(createDeck, updateDisplay));
    } else if (blackjackState === "in-game") {
        drawCard();
    } else if (blackjackState === "done") {
        resetGame(createDeck, updateDisplay);
        startCountDown(() => resetGame(createDeck, updateDisplay));
    }
});

stayBtn.addEventListener("click", () => {
    playButtonSound();
    if (blackjackState === "in-game") {
        playerStay = true;
        dealerTurn();
    }
});

resetGame(createDeck, updateDisplay);