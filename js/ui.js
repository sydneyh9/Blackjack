//ui.js

import {blackjackState, your_cards, dealer_cards, current_score, dealer_score, win_or_lose, calculateScore} from './game.js';
import {toggleMusic} from './audio.js';

const yourcardsElement = document.getElementById('your_cards');
const currentscoreElement = document.getElementById('current_score');
const dealercardsElement = document.getElementById('dealer_cards');
const dealerscoreElement = document.getElementById('dealer_score');
const winorloseElement = document.getElementById('win_or_lose');
const turnElement = document.getElementById('turn');
const countdownElement = document.getElementById('countdown');
const instructionsOverlay = document.getElementById('instructions-overlay');

export function showInstructions() {
    instructionsOverlay.style.display = 'flex';
}

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
                toggleMusic(true);
                if (typeof startGame === 'function') {
                    startGame();
                }
            }, 1000);
        }
    }, 1000);
}

//updating the display 
export function updateDisplay(showDealer = false, animate = false) {
    //empty container to house cards animation
    yourcardsElement.innerHTML = '';
    dealercardsElement.innerHTML = '';

    const suitSymbols = {
        'Hearts': '♥️',
        'Diamonds': '♦️',
        'Clubs': '♣️',
        'Spades': '♠️'
    };

    //create the cards based on what is drawn
    your_cards.forEach((card, index) => {
        //container for card
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        //creation of card
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        //card text
        const front = document.createElement('div');
        front.className = 'card-front';

        const suitSymbol = suitSymbols[card.suit];
        const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';

        front.innerHTML = `
        <div class="card-corner top-left"> ${card.rank} <br> ${suitSymbol}</div>
        <div class="card-center"> ${suitSymbol}</div>
        <div class="card-corner bottom-right"> ${card.rank}<br> ${suitSymbol}</div>`;

        front.classList.add(isRed ? 'red-card' : 'black-card');

        const back = document.createElement('div');
        back.className = 'card-back';
        back.textContent = '?';

        cardElement.appendChild(front);
        cardElement.appendChild(back);
        cardContainer.appendChild(cardElement);
        if (animate && index === your_cards.length - 1) {
            cardContainer.classList.add('swipe-in');
            cardContainer.addEventListener('animationend', () => {
                cardContainer.classList.remove('swipe-in');
            }, { once: true });
        }
        yourcardsElement.appendChild(cardContainer);
    });
    const score = calculateScore(your_cards);
    currentscoreElement.textContent = `Current Score: ${score}`;
    //empty container to house dealer cards animation
    if (dealer_cards.length === 0) {
        dealerscoreElement.textContent = '';
    } else if (showDealer && blackjackState === "done") {
        dealer_cards.forEach((card, index) => {
            const cardContainer = document.createElement('div');
            //only plays if we're not finished the round
            cardContainer.className = 'card-container';
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            //card front
            const front = document.createElement('div');
            front.className = 'card-front';
            
            const suitSymbol = suitSymbols[card.suit];
            const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';

            front.innerHTML = `
            <div class="card-corner top-left"> ${card.rank} <br> ${suitSymbol}</div>
            <div class="card-center"> ${suitSymbol}</div>
            <div class="card-corner bottom-right"> ${card.rank}<br> ${suitSymbol}</div>`;

            front.classList.add(isRed ? 'red-card' : 'black-card');
            //card back
            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = '?';
            cardElement.appendChild(front);
            cardElement.appendChild(back);
            cardContainer.appendChild(cardElement);
            if(animate && index === dealer_cards.length - 1 && blackjackState === "dealer-turn" && blackjackState !== "done") {
                //swipe in animation triggered
                cardContainer.classList.add('swipe-in');
                cardContainer.addEventListener('animationend', () => {
                    cardContainer.classList.remove('swipe-in');
                }, { once: true });
            } 

            //when the slide in ends, add flipped animation
            //if it's the dealer's turn, do the same to its animations else {
            dealercardsElement.appendChild(cardContainer);
        });

        //after the dealer's turn is over, show the first card
        if (blackjackState === "done") {
            const dealerCardElements = dealercardsElement.querySelectorAll('.card');
            const firstDealerCard = dealerCardElements[0];
            if (firstDealerCard) {
                firstDealerCard.classList.remove('flipped'); ///reveal the first card
            }
        }
        //calculate and display dealer's score
        const dealersScore = calculateScore(dealer_cards);
        dealerscoreElement.textContent = `Dealer's Score: ${dealersScore}`;
    } else {

        //creates dealer cards images and only shows the second card onward
        dealer_cards.forEach((card, index) => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            const cardElement = document.createElement('div');
            cardElement.className = 'card';

            const front = document.createElement('div');
            front.className = 'card-front';
            
            const suitSymbol = suitSymbols[card.suit];
            const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';

            front.innerHTML = `
            <div class="card-corner top-left"> ${card.rank} <br> ${suitSymbol}</div>
            <div class="card-center"> ${suitSymbol}</div>
            <div class="card-corner bottom-right"> ${card.rank}<br> ${suitSymbol}</div>`;

            front.classList.add(isRed ? 'red-card' : 'black-card');

            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = '?';

            cardElement.appendChild(front);
            cardElement.appendChild(back);
            
            //if it's the dealer's turn, do the same to its animations

            cardContainer.appendChild(cardElement);
            if (index == 0) {
                cardElement.classList.add('flipped');
            }
            if (animate) {
                cardContainer.classList.add('swipe-in');
                cardContainer.addEventListener('animationend', () => {
                    cardContainer.classList.remove('swipe-in');
        }, {once:true});
    } 
        dealercardsElement.appendChild(cardContainer);
    });
        //hides the first card in the dealer's cards from the player
        const visibleCards = dealer_cards.slice(1);
        const visibleScore = calculateScore(visibleCards);
        dealerscoreElement.textContent = `Dealer's Score: ??? + ${visibleScore}`;
    }
    winorloseElement.textContent = win_or_lose ? `${win_or_lose}` : '';

    if (blackjackState === "in-game") {
        turnElement.textContent = "Your turn.";
    } else if (blackjackState === "dealer-turn") {
        turnElement.textContent = "Dealer's turn.";
    } else if (blackjackState === "done") {
        turnElement.textContent = "Game over.";
    } else {
        turnElement.textContent = "";
    }     
}