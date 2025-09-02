//game.js

import {draw} from "./deck.js";
import {updateDisplay, endRound} from "./ui.js";

export let blackjackState = "start";
export let cards = [];
export let your_cards = [];
export let dealer_cards = [];
export let current_score = 0;
export let dealer_score = 0;
export let playerStay = false;
export let dealerStay = false;
export let win_or_lose = "";

export function startGame() {
    blackjackState = "in-game";

    //gives two cards to the dealer and two to the player
    dealer_cards.push(draw(cards), draw(cards));
    your_cards.push(draw(cards), draw(cards));

    //reset the scores
    current_score = calculateScore(your_cards);
    dealer_score = calculateScore(dealer_cards);

    //update the board: hiding the dealer's first card and animate deal button
    updateDisplay(false, true);
}

export function resetGame(deckCreator, toggleButtons) {
    cards = deckCreator();
    your_cards = [];
    dealer_cards = [];
    current_score = 0;
    dealer_score = 0;
    playerStay = false;
    dealerStay = false;
    win_or_lose = "";
    blackjackState = "start";
    toggleButtons();
    updateDisplay();
}

export function drawCard() {
    if (blackjackState !== "in-game") {
        return;
    }
    let newCard = draw(cards);
    if (!newCard) {
        return;
    }
    your_cards.push(newCard);
    current_score = calculateScore(your_cards);
    if (current_score > 21) {
        endRound("You went over. You lose!");
        finalizeDealerTurn();
        return;
    }
    updateDisplay();
    dealerTurn();
}
export function dealerTurn() {
    if (blackjackState === "done") {
        return;
    }
    blackjackState = "dealer-turn";
    dealer_score = calculateScore(dealer_cards);
    if (dealer_score < 17) {
        let card = draw(cards);
        dealer_cards.push(card);
        updateDisplay(true, true);
        setTimeout(dealerTurn, 1000);
    } else {
        dealerStay = true;
        if (playerStay) {
            finalizeDealerTurn();
        } else {
            blackjackState = "in-game";
            updateDisplay(blackjackState === "done", false);
        }
    }
}

export function finalizeDealerTurn() {
    dealer_score = calculateScore(dealer_cards);
    updateDisplay(true,true);
    setTimeout(calculateGameResult, 650);
}

export function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    for (let card of hand) {
        score += card.value;
        if (card.rank === 'A') {
            aces++;
        }
    }
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

export function calculateGameResult() {
    if (dealer_score > 21 && current_score > 21) {
        win_or_lose = (current_score < dealer_score) 
        ? "You both went over but you have the better hand! You win!" : "You both went over but the dealer has the better hand! Dealer wins."; 
    } else if (dealer_score > 21) {
        win_or_lose = "Dealer went over. You win!";
    } else if (current_score > 21) {
        win_or_lose = "You went over! Dealer wins.";
    } else if (dealer_score === current_score) {
        win_or_lose = "Looks like you tied. It's a draw.";
    } else if (current_score === 21) {
        win_or_lose = "A perfect 21. You win!";
    } else if (dealer_score > current_score) {
        win_or_lose = "Dealer wins!";
    } else {
        win_or_lose = "You win!";
    }
    endRound(win_or_lose);
}
