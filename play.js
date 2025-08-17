document.addEventListener('DOMContentLoaded', () => {
    //my card deck
function createDeck() {
    //funtion to create a new deck out of the following values to use for a new round
    const newDeck = [];
    const cardValues = [2,3,4,5,6,7,8,9,10,10,10,10,11];
    for (let i = 0; i < 4; i++) {
        for (let card of cardValues) {
            newDeck.push(card);
        }
    }
    return newDeck;
}
let cards = createDeck();
let your_cards = [];
let dealer_cards = [];
let dealer_first_card = 0;
let dealer_second_card = 0;
let first_card = 0;
let second_card = 0;
let current_score = 0;
let dealer_score = 0;
let win_or_lose = "";
let blackjackState = "start";

//establish button for dealing the cards
const button = document.getElementById('deal');
const buttonStay = document.getElementById('stay');
const yourcards = document.getElementById('your_cards');
const currentscore = document.getElementById('current_score');
const dealercards = document.getElementById('dealer_cards');
const dealerfirstcard = document.getElementById('dealer_first_card');
const dealerscore = document.getElementById('dealer_score');
const winorlose = document.getElementById('win_or_lose');

//resetting game function for every new round
function resetGame() {
    cards = createDeck();
    your_cards = [];
    dealer_cards = [];
    first_card = 0;
    second_card = 0;
    dealer_first_card = 0;
    dealer_second_card = 0;
    current_score = 0;
    dealer_score = 0;
    win_or_lose = "";
    blackjackState = "start";
    yourcards.innerHTML = "";
    dealercards.innerHTML = "";
    currentscore.textContent = "";
    dealerfirstcard.textContent = "";
    dealerscore.textContent = "";
    button.setAttribute('data-label', 'Deal');
    button.disabled = false;
    //stay button should not be available at the start of the game
    buttonStay.disabled = true;
    /*hide stay button when reset */
    buttonStay.style.visibility = 'hidden';
    updateDisplay();
}

//draw card from the deck function
//pulls a random card from the pile and removes it from the deck as per house rules
function draw() {
    if (cards.length === 0) {
        return 0;
    }
    let index = Math.floor(Math.random() * cards.length);
    return cards.splice(index, 1)[0];
}

//pulls new cards
function drawCard() {
    let newCard = draw();
    your_cards.push(newCard);
    current_score += newCard;
    if (current_score > 21) {
        win_or_lose = "You went over. You Lose!";
        blackjackState = "done";
        button.setAttribute('data-label', 'Restart');
        button.disabled = false;
        buttonStay.disabled = true;
        //round is over, reveal the dealer's cards
        updateDisplay(true);
        return;
    }
    //keep them hidden
    updateDisplay();
}

//dealer continues to hit until they hit a score of >= 17
function dealerTurn() {
    blackjackState = "dealer-turn";
    button.disabled = true;
    buttonStay.disabled = true;
    
    //add up the dealer_score
    dealer_score = dealer_cards.reduce((a,b) => a + b, 0);
    //if the dealer's score is less than 17, it'll automatically draw another card
     if(dealer_score < 17) {
        let card = draw();
        dealer_cards.push(card);
        //update the display for the dealer cards
        updateDisplay(true);
        //animation new dealer card 
        const cards = dealercards.querySelectorAll('.card');
        const lastCard = cards[cards.length - 1];
        if (lastCard) {
            lastCard.classList.add('swipe-in');
            lastCard.addEventListener('animationend', () => {
                lastCard.classList.remove('swipe-in');
                setTimeout(finalizeDealerTurn, 3000);
            }, { once: true });
        } else {
            //after animation is done, 500ms delay before next card is draw
            setTimeout(finalizeDealerTurn, 3000);
        }
    } else {
        //when the dealer is done drawing, calculate result
        finalizeDealerTurn();
    }
}

            //updateDisplay(true);
            //play the dealer card draw animation

            //setting the drawing the next card for a 2 second delay
        function finalizeDealerTurn() {
            dealer_score = dealer_cards.reduce((a,b) => a + b, 0);
        
            if (dealer_score > 21 && current_score > 21) {
                if (current_score < dealer_score) {
                    win_or_lose = "You both went over but you have the better hand! You win!";
                }
                else if (current_score > dealer_score) {
                    win_or_lose = "You both went over but the dealer has the better hand! Dealer wins.";
                }
                blackjackState = "done";
                button.setAttribute('data-label', 'Restart');
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true);
            }
                else if (dealer_score > 21 && current_score <= 21) {
                    win_or_lose = "Dealer went over. You win!";
                    blackjackState = "done";
                    button.setAttribute('data-label', 'Restart');
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                } else if (current_score > 21 && dealer_score <= 21) {
                    win_or_lose = "You went over! Dealer wins.";
                    blackjackState = "done";
                    button.setAttribute('data-label', 'Restart');
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                } else if (dealer_score === current_score) {
                    win_or_lose = "Looks like you tied. It's a draw.";
                    blackjackState = "done";
                    button.setAttribute('data-label', 'Restart');
                    buttonStay.disabled = true;
                    button.disabled = false;
                    updateDisplay(true);
                } else if (current_score == 21) {
                    win_or_lose = "A perfect 21. You win!";
                    blackjackState = "done";
                    button.setAttribute('data-label', 'Restart');
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                }  else if (dealer_score > current_score) {
                    win_or_lose = "Oh no! The dealer has a better hand. Dealer wins.";
                    blackjackState = "done";
                    button.setAttribute('data-label', 'Restart');
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                } else {
                    win_or_lose = "You have a better hand! You win!";
                    blackjackState = "done";
                    button.setAttribute('data-label', 'Restart');
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                }
            }
//updating the display 
function updateDisplay(showDealer = false) {
    //empty container to house cards animation
    yourcards.innerHTML = '';
    //create the cards based on what is drawn
    your_cards.forEach((cardValue, index) => {
        //container for card
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        //creation of card
        const card = document.createElement('div');
        card.className = 'card';
        //card text
        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = cardValue;

        const back = document.createElement('div');
        back.className = 'card-back';
        back.textContent = '?';

        card.appendChild(front);
        card.appendChild(back);
        cardContainer.appendChild(card);
        if (index === your_cards.length - 1 && blackjackState !== "start") {
            card.classList.add('swipe-in');
        }
        yourcards.appendChild(cardContainer);
    });
    currentscore.textContent = `Current Score: ${current_score}`;
    //empty container to house dealer cards animation
    dealercards.innerHTML = '';
    if (dealer_cards.length === 0) {
        dealerscore.textContent = "";
    } else if (showDealer) {
        dealer_cards.forEach((cardValue, index) => {
            const cardContainer = document.createElement('div');
            //swipe in animation triggered
            cardContainer.className = 'card-container swipe-in';
            const card = document.createElement('div');
            card.className = 'card';
            //card front
            const front = document.createElement('div');
            front.className = 'card-front';
            front.textContent = cardValue;
            //card back
            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = '?';
            card.appendChild(front);
            card.appendChild(back);
            cardContainer.appendChild(card);
            //dealercards.appendChild(cardContainer);
            //when the slide in ends, add flipped animation
            cardContainer.addEventListener('animationend', () => {
                cardContainer.classList.remove('swipe-in');
            }, { once: true });
            //if it's the dealer's turn, do the same to its animations
            if (index === dealer_cards.length - 1 && blackjackState === "dealer-turn") {
                card.classList.add('swipe-in');
                card.addEventListener('animationend', () => {
                    card.classList.remove('swipe-in');
                }, { once: true });
            } else {
            }
            dealercards.appendChild(cardContainer);
        });
        dealer_score = dealer_cards.reduce((a,b) => a + b, 0);
        dealerscore.textContent = `Dealer's Score: ${dealer_score}`;
    } else {

        //creates dealer cards images
        dealer_cards.forEach((cardValue, index) => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            const card = document.createElement('div');
            card.className = 'card';

            const front = document.createElement('div');
            front.className = 'card-front';
            front.textContent = cardValue;

            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = '?';

            card.appendChild(front);
            card.appendChild(back);
            cardContainer.appendChild(card);

            //the first card is hidden 
            if (index === 0 && !showDealer) {
                card.classList.add('flipped');
            } else {
                card.classList.remove('flipped');
            }
            dealercards.appendChild(cardContainer);
        });
        //hides the first card in the dealer's cards from the player
        const visibleCards = dealer_cards.slice(1);
        const visibleScore = visibleCards.reduce((a,b) => a + b, 0);
        //dealerfirstcard.textContent = `Dealer's Cards: ?, ${visibleCards.join(',')}`;
        dealerscore.textContent = `Dealer's Score: ??? + ${visibleScore}`;
    }
    winorlose.textContent = win_or_lose ? `Result: ${win_or_lose}` : '';
    console.log("Your cards:", your_cards);
    console.log("Result:", win_or_lose);
    console.log("Dealer's first card:",dealer_first_card);
    console.log("Current Score:", current_score);
    console.log("Dealer's Score:", dealer_score);
}

//function for the deal button click
function onButtonClick() {
    //fun spin animation for when buttons are clicked
    button.classList.add('spin');
    button.addEventListener('animationend', () => {
        button.classList.remove('spin');
    }, { once: true });

    if(blackjackState === "start") {
        startGame();
        buttonStay.style.visibility = 'visible';
    } else if (blackjackState === "in-game") {
        drawCard();
        if (blackjackState !== "done") {
            dealerTurn();
        }
    } else if (blackjackState === "done") {
        resetGame();
        startGame();
        buttonStay.style.visibility = 'visible';
    }
}

//function for the player to have a stay option
function onStayClick() {
    //fun spin animation for when buttons are clicked
    buttonStay.classList.add('spin');
    buttonStay.addEventListener('animationend', () => {
        buttonStay.classList.remove('spin');
    }, { once: true });
    if (blackjackState === "in-game") {
        dealerTurn();
    }
}

//function for starting the game
function startGame() {
    blackjackState = "in-game";
    button.setAttribute('data-label', 'Deal');
    button.disabled = false;
    buttonStay.disabled = false;
    buttonStay.style.visibility = 'visible';
    //the dealer gets their cards
    dealer_first_card = draw();
    dealer_second_card = draw();
    dealer_cards.push(dealer_first_card, dealer_second_card);
    

    //you get your cards
    first_card = draw();
    second_card = draw();
    your_cards.push(first_card, second_card);

    //update scores
    current_score = first_card + second_card;

    updateDisplay();

    //win or lose skeleton
    if (current_score > 21) {
        win_or_lose = "You went over. You lose!";
        console.log("Your Final Hand: ", your_cards);
        console.log("Your Final Score: ", current_score);
        console.log("You went over. You lose!");
        blackjackState = "done";
        button.setAttribute('data-label', 'Deal');
        buttonStay.disabled = true;
        updateDisplay(true);
    }
}

//listener for button
button.addEventListener('click', onButtonClick);
buttonStay.addEventListener('click', onStayClick);

//Initialize First Round
resetGame();

});