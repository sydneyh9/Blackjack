document.addEventListener('DOMContentLoaded', () => {
    const countdown = document.getElementById('countdown');

    function startCountDown() {
        let timeLeft = 3;
        countdown.textContent = `${timeLeft}`;
        countdown.style.visibility = 'visible';
        countdown.style.opacity = '0.6';

        button.disabled = true;
        buttonStay.disabled = true;

        const gameInformation = document.getElementById('game_information');
        //hide the game information until the countdown ends
        if (gameInformation) gameInformation.style.visibility = 'hidden';
        //timer for countdown set up
        const timerId = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                countdown.textContent = `${timeLeft}`;
            } else {
                clearInterval(timerId);
                countdown.textContent = "Let's play!";
                setTimeout(() => {
                    countdown.style.opacity = '0';
                    setTimeout(() => {
                    countdown.style.visibility = 'hidden';
                    countdown.textContent = "";
                    countdown.style.opacity = '0.6';

                    //unhide game information
                    if (gameInformation) gameInformation.style.visibility = 'visible';
                    //start the game and undisable the buttons
                    startGame();
                    button.disabled = false;
                    buttonStay.disabled = false;
                }, 300);
            }, 1000);
        }
        }, 1000);
    }
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
let playerStay = false;
let dealerStay = false;
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

    const gameInformation = document.getElementById('game_information');
    if(gameInformation) gameInformation.style.visibility = 'hidden';
    cards = createDeck();
    your_cards = [];
    dealer_cards = [];
    first_card = 0;
    second_card = 0;
    dealer_first_card = 0;
    playerStay = false;
    dealerStay = false;
    dealer_second_card = 0;
    current_score = 0;
    dealer_score = 0;
    win_or_lose = "";
    button.classList.add('centered');
    blackjackState = "start";
    if (yourcards) yourcards.innerHTML = "";
    if (dealercards) dealercards.innerHTML = "";
    if (currentscore) currentscore.textContent = "";
    if (dealerfirstcard) dealerfirstcard.textContent = "";
    if (dealerscore) dealerscore.textContent = "";
    if (winorlose) winorlose.textContent = "";
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
    if (blackjackState !== "in-game") {
        return;
    }
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
        finalizeDealerTurn();
        return;
    }
    //keep them hidden
    updateDisplay();

    //dealer gets to take another turn after player draws
    dealerTurn();
}

//dealer continues to hit until they hit a score of >= 17
function dealerTurn() {

    if (blackjackState === "done") return;
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
        updateDisplay(true,true);
        //animate and then continue dealer turn
        //waits before the player gets their turn again to reduce abruptness
        setTimeout(() => {
            if (!playerStay) {
                blackjackState = "in-game";
                button.disabled = false;
                buttonStay.disabled = false;
                updateDisplay(blackjackState === "done", false);
            } else {
                //continue to have the dealer draw until they hit >= 17
                dealerTurn();
            }
            }, 1000);
    } else {
        //when the dealer is done drawing and player is done drawing, calculate result
        dealerStay = true;
        if (playerStay) {
            finalizeDealerTurn();
        } else {
            blackjackState = "in-game";
            button.disabled = false;
            buttonStay.disabled = false;
            updateDisplay(true, false);
        }
    }
}

            //play the dealer card draw animation
            //setting the drawing the next card for a 2 second delay
        function finalizeDealerTurn() {
            dealer_score = dealer_cards.reduce((a,b) => a + b, 0);

            updateDisplay(true,true);

            const dealerCardElement = dealercards.querySelectorAll('.card');
            const firstDealerCard = dealerCardElement[0];
        
            if (firstDealerCard) {
                    firstDealerCard.classList.remove('flipped');
                    setTimeout(() => {
                        calculateGameResult();
                    }, 650);
            } else {
                calculateGameResult();
            }
        }

        function calculateGameResult() {
            if (dealer_score > 21 && current_score > 21) {
                if (current_score < dealer_score) {
                    win_or_lose = "You both went over but you have the better hand! You win!";
                } else {
                    win_or_lose = "You both went over but the dealer has the better hand! Dealer wins.";
                }
            } else if (dealer_score > 21 && current_score <= 21) {
                win_or_lose = "Dealer went over. You win!";
                blackjackState = "done";
                button.setAttribute('data-label', 'Restart');
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true, false);
            } else if (current_score > 21 && dealer_score <= 21) {
                win_or_lose = "You went over! Dealer wins.";
                blackjackState = "done";
                button.setAttribute('data-label', 'Restart');
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true, false);
            } else if (dealer_score === current_score) {
                win_or_lose = "Looks like you tied. It's a draw.";
                blackjackState = "done";
                button.setAttribute('data-label', 'Restart');
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true, false);
            } else if (current_score == 21) {
                win_or_lose = "A perfect 21. You win!";
                blackjackState = "done";
                button.setAttribute('data-label', 'Restart');
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true, false);
            }  else if (dealer_score > current_score) {
                win_or_lose = "Oh no! The dealer has a better hand. Dealer wins.";
                blackjackState = "done";
                button.setAttribute('data-label', 'Restart');
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true, false);
            } else {
                win_or_lose = "You have a better hand! You win!";
                blackjackState = "done";
                button.setAttribute('data-label', 'Restart');
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true, false);
            }
                blackjackState = "done";
                button.setAttribute('data-label', 'Restart');
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true, false);
        }
            
//updating the display 
function updateDisplay(showDealer = false, animate = false) {
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
        if (animate && index === your_cards.length - 1) {
            cardContainer.classList.add('swipe-in');
            cardContainer.addEventListener('animationend', () => {
                cardContainer.classList.remove('swipe-in');
            }, { once: true });
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
            //only plays if we're not finished the round
            cardContainer.className = 'card-container';
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
            if(animate && dealer_cards.length - 1 && (blackjackState === "dealer-turn" || blackjackState === "in-game" && dealer_cards.length === 2)) {
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
            
            //if it's the dealer's turn, do the same to its animations

            if (index === 0 && blackjackState !== "done") {
                card.classList.add('flipped');
            }
            if (animate && blackjackState !== "done") {
                cardContainer.classList.add('swipe-in');
                cardContainer.addEventListener('animationend', () => {
                    cardContainer.classList.remove('swipe-in');
                }, { once: true });
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

    const turn = document.getElementById('turn');
    if (turn) {
        if (blackjackState === "start") {
            turn.textContent = "Press Deal to begin!";
        } else if (blackjackState === "in-game") {
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

//function for the deal button click
function onButtonClick() {
    //fun spin animation for when buttons are clicked
    button.classList.add('spin');
    button.addEventListener('animationend', () => {
        button.classList.remove('spin');
    }, { once: true });

    if(blackjackState === "start") {
        startCountDown();
        buttonStay.style.visibility = 'visible';
    } else if (blackjackState === "in-game") {
        drawCard();
    } else if (blackjackState === "done") {
        resetGame();
        startCountDown();
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
        playerStay = true;
        dealerTurn();
    }
}

//function for starting the game
function startGame() {
    blackjackState = "in-game";
    button.setAttribute('data-label', 'Deal');
    button.disabled = false;
    buttonStay.disabled = false;
    button.classList.remove('centered');
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

    updateDisplay(false, true);

    //win or lose skeleton
    if (current_score > 21) {
        win_or_lose = "You went over. You lose!";
        console.log("Your Final Hand: ", your_cards);
        console.log("Your Final Score: ", current_score);
        console.log("You went over. You lose!");
        blackjackState = "done";
        button.setAttribute('data-label', 'Deal');
        buttonStay.disabled = true;
        updateDisplay(true, true);
    }
}

//listener for button
button.addEventListener('click', onButtonClick);
buttonStay.addEventListener('click', onStayClick);

//Initialize First Round
resetGame();

});