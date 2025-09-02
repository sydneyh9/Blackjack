//game.js

import {draw} from "./deck.js";
import {updateDisplay, endRound} from "./ui.js";

export let gameState = {
    blackjackState: "start",
    cards: [],
    your_cards: [],
    dealer_cards: [],
    current_score: 0,
    dealer_score: 0,
    playerStay: false,
    dealerStay: false,
    win_or_lose: ""
}

gameState.playerStay = true;
export function startGame() {
    gameState.blackjackState = "in-game";

    //gives two cards to the dealer and two to the player
    //game.js

    gameState.dealer_cards.push(draw(cards), draw(cards));
    gameState.your_cards.push(draw(cards), draw(cards));

    //reset the scores
    gameState.current_score = calculateScore(your_cards);
    gameState.dealer_score = calculateScore(dealer_cards);

    //update the board: hiding the dealer's first card and animate deal button
    updateDisplay(false, true);
}

export function resetGame(deckCreator, toggleButtons) {
    gameState.cards = deckCreator();
    gameState.your_cards = [];
    gameState.dealer_cards = [];
    gameState.current_score = 0;
    gameState.dealer_score = 0;
    gameState.playerStay = false;
    gameState.dealerStay = false;
    gameState.win_or_lose = "";
    gameState.blackjackState = "start";
    toggleButtons();
    updateDisplay();
}

export function drawCard() {
    if (gameState.blackjackState !== "in-game") {
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
    if (gameState.blackjackState === "done") {
        return;
    }
    gameState.blackjackState = "dealer-turn";
    gameState.dealer_score = calculateScore(dealer_cards);
    if (gameState.dealer_score < 17) {
        let card = draw(gameState.cards);
        gameState.dealer_cards.push(card);
        updateDisplay(true, true);
        setTimeout(dealerTurn, 1000);
    } else {
        gameState.dealerStay = true;
        if (gameState.playerStay) {
            finalizeDealerTurn();
        } else {
            gameState.blackjackState = "in-game";
            updateDisplay(false, false);
        }
    }
}

export function finalizeDealerTurn() {
    gameState.dealer_score = calculateScore(gameState.dealer_cards);
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
    if (gameState.dealer_score > 21 && gameState.current_score > 21) {
        gameState.win_or_lose = (gameState.current_score < gameState.dealer_score) 
        ? "You both went over but you have the better hand! You win!" : "You both went over but the dealer has the better hand! Dealer wins."; 
    } else if (gameState.dealer_score > 21) {
        gameState.win_or_lose = "Dealer went over. You win!";
    } else if (gameState.current_score > 21) {
        gameState.win_or_lose = "You went over! Dealer wins.";
    } else if (gameState.dealer_score === gameState.current_score) {
        gameState.win_or_lose = "Looks like you tied. It's a draw.";
    } else if (gameState.current_score === 21) {
        gameState.win_or_lose = "A perfect 21. You win!";
    } else if (dealer_score > gameState.current_score) {
        gameState.win_or_lose = "Dealer wins!";
    } else {
        gameState.win_or_lose = "You win!";
    }
    endRound(gameState.win_or_lose);
}
