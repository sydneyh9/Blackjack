import {calculateScore} from './score.js';
import { your_cards, dealer_cards, current_score, dealer_score, blackjackState, win_or_lose} from './gameState.js';

const yourcards = document.getElementById('yourcards');
const currentscore = document.getElementById('current_score');
const dealercards = document.getElementById('dealer_cards');
const dealerscore = document.getElementById('dealer_score');
const winorlose = document.getElementById('win_or_lose');
const turn = document.getElementById('turn');

const suitSymbols = {
    'Hearts': '♥️',
    'Diamonds': '♦️',
    'Clubs': '♣️',
    'Spades': '♠️'
};

//updating the display 
export function updateDisplay(showDealer = false, animate = false) {
    //empty container to house cards animation
    yourcards.innerHTML = '';
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
        yourcards.appendChild(cardContainer);
    });
    current_score = calculateScore(your_cards);
    currentscore.textContent = `Current Score: ${current_score}`;
    //empty container to house dealer cards animation
    dealercards.innerHTML = '';
    if (dealer_cards.length === 0) {
        dealerscore.textContent = "";
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
            dealercards.appendChild(cardContainer);
        });

        //after the dealer's turn is over, show the first card
        if (blackjackState === "done") {
            const dealerCardElements = dealercards.querySelectorAll('.card');
            const firstDealerCard = dealerCardElements[0];
            if (firstDealerCard) {
                firstDealerCard.classList.remove('flipped'); ///reveal the first card
            }
        }
        //calculate and display dealer's score
        dealer_score = calculateScore(dealer_cards);
        dealerscore.textContent = `Dealer's Score: ${dealer_score}`;
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
        dealercards.appendChild(cardContainer);
    });
        //hides the first card in the dealer's cards from the player
        const visibleCards = dealer_cards.slice(1);
        const visibleScore = calculateScore(visibleCards);
        dealerscore.textContent = `Dealer's Score: ??? + ${visibleScore}`;
    }
    winorlose.textContent = win_or_lose ? `${win_or_lose}` : '';

    if (turn) {
        if (blackjackState === "in-game") {
            turn.textContent = "Your turn.";
        } else if (blackjackState === "dealer-turn") {
            turn.textContent = "Dealer's turn.";
        } else if (blackjackState === "done") {
            turn.textContent = "Game over.";
        } else {
            turn.textContent = "";
        }
        
    }
}