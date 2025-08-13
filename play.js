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
let dealer_choice = 0;
let final_hand = "";
let computer_final_hand = "";
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
    yourcards.textContent = "";
    currentscore.textContent = "";
    dealerfirstcard.textContent = "";
    dealerscore.textContent = "";
    winorlose.textContent = "";
    button.textContent = "Deal";
    button.disabled = false;
    //stay button should not be available at the start of the game
    buttonStay.disabled = true;
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
        button.textContent = "Restart";
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
    
    function dealerDraw() {
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
                    lastCardc.classList.remove('swipe-in');
                    setTimeout(dealerDraw, 500);
                }, { once: true });
            } else {
                 //after animation is done, 500ms delay before next card is draw
                setTimeout(dealerDraw, 500);
            }
        } else {
            //when the dealer is done drawing, calculate result
            finalizeDealerTurn();
        }
    } dealerDraw();
    }

    function animateLastDealerCard(callback) {
        //show all of the dealer's cards 
        updateDisplay(true);
        //get last dealer card element
        const cards = dealercards.querySelectorAll('.card');
        if (cards.length === 0) {
            if (callback) callback();
            return;
        }
        const lastCard = cards[cards.length - 1];
        //add animation class to the last card
        lastCard.classList.add('swipe-in');

        //animation event listener end
        lastCard.addEventListener('animationend', () => {
            lastCard.classList.remove('swipe-in');
            if (callback) callback();
        }, { once: true});

    }
            //updateDisplay(true);
            //play the dealer card draw animation

            //setting the drawing the next card for a 2 second delay
            //setTimeout(dealerDraw, 2000);
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
                button.textContent = "Restart";
                button.disabled = false;
                buttonStay.disabled = true;
                updateDisplay(true);
            }
                else if (dealer_score > 21 && current_score <= 21) {
                    win_or_lose = "Dealer went over. You win!";
                    blackjackState = "done";
                    button.textContent = "Restart";
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                } else if (current_score > 21 && dealer_score <= 21) {
                    win_or_lose = "You went over! Dealer wins.";
                    blackjackState = "done";
                    button.textContent = "Restart";
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                } else if (dealer_score === current_score) {
                    win_or_lose = "Looks like you tied. It's a draw.";
                    blackjackState = "done";
                    button.textContent = "Restart";
                    buttonStay.disabled = true;
                    button.disabled = false;
                    updateDisplay(true);
                } else if (current_score == 21) {
                    win_or_lose = "A perfect 21. You win!";
                    blackjackState = "done";
                    button.textContent = "Restart";
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                }  else if (dealer_score > current_score) {
                    win_or_lose = "Oh no! The dealer has a better hand. Dealer wins.";
                    blackjackState = "done";
                    button.textContent = "Restart";
                    button.disabled = false;
                    buttonStay.disabled = true;
                    updateDisplay(true);
                } else {
                    win_or_lose = "You have a better hand! You win!";
                    blackjackState = "done";
                    button.textContent = "Restart";
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
        const cardElement = document.createElement('span');
        cardElement.className = 'card';
        cardElement.textContent = cardValue;
        cardElement.dataset.value = cardValue;
        if (index === your_cards.length - 1 && blackjackState !== "start") {
            cardElement.classList.add('swipe-in');
        }
        yourcards.appendChild(cardElement);
    });
    currentscore.textContent = `Current Score: ${current_score}`;
    //empty container to house dealer cards animation
    dealercards.innerHTML = '';
    if (showDealer) {
        dealer_cards.forEach((cardValue, index) => {
            const cardElement = document.createElement('span');
            cardElement.className = 'card';
            cardElement.textContent = cardValue;
            cardElement.dataset.value = cardValue;
            if (index === dealer_cards.length - 1 && blackjackState === "dealer-turn") {
                cardElement.classList.add('swipe-in');
                cardElement.addEventListener('animationend', () => {
                    cardElement.classList.remove('match-animate');
                }, { once: true });
            }
            dealercards.appendChild(cardElement);
        });
        dealer_score = dealer_cards.reduce((a,b) => a + b, 0);
        dealerscore.textContent = `Dealer's Score: ${dealer_score}`;
    } else {

        //show the hidden card 
        const hiddenCard = document.createElement('span');
        hiddenCard.className = 'card';
        hiddenCard.textContent = '?';
        dealercards.appendChild(hiddenCard);
        //hides the first card in the dealer's cards from the player
        const visibleCards = dealer_cards.slice(1);
        visibleCards.forEach(cardValue => {
            const cardElement = document.createElement('span');
            cardElement.className = 'card';
            cardElement.textContent = cardValue;
            cardElement.dataset.value = cardValue;
            dealercards.appendChild(cardElement);
        });
        const visibleScore = visibleCards.reduce((a,b) => a + b, 0);
        //dealerfirstcard.textContent = `Dealer's Cards: ?, ${visibleCards.join(',')}`;
        dealerscore.textContent = `Dealer's Score: ??? + ${visibleScore}`;
    }
    winorlose.textContent = `Result: ${win_or_lose}`;
    console.log("Your cards:", your_cards);
    console.log("Result:", win_or_lose);
    console.log("Dealer's first card:",dealer_first_card);
    console.log("Current Score:", current_score);
    console.log("Dealer's Score:", dealer_score);
}

//function for the deal button click
function onButtonClick() {
    if(blackjackState === "start") {
        startGame();
    } else if (blackjackState === "in-game") {
        drawCard();
    } else if (blackjackState === "done") {
        resetGame();
        startGame();
    }
}

//function for the player to have a stay option
function onStayClick() {
    if (blackjackState === "in-game") {
        dealerTurn();
    }
}

//function for starting the game
function startGame() {
    blackjackState = "in-game";
    button.textContent = "Deal";
    button.disabled = false;
    buttonStay.disabled = false;
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
        button.textContent = "Restart";
        buttonStay.disabled = true;
        updateDisplay(true);
    }
}

//starts the animation for pulling a card after deal button is pressed
function CardAnimation(matchedValue) {
    const cards = document.querySelectorAll('#your_cards .card');
    cards.forEach(card => {
        if(parseInt(card.dataset.value) === matchedValue) {
            card.classList.add('match-animate');
            //when the animation ends, remove the animation so it can be restarted
            card.addEventListener('animationend',() => {
                card.classList.remove('match-animate');
            }, { once:true });
        }
    });
}

//starts the animation for the dealer pulling a card during the dealer's turn
/*function DealerCardAnimation(matchedValue) {
    const cards = document.querySelectorAll('#dealer_cards .card');
    cards.forEach(card => {
        if(parseInt(card.dataset.value) === matchedValue) {
            card.classList.add('match-animate');
            //when the animation ends, remove the animation so it can be restarted
            card.addEventListener('animationend',() => {
                card.classList.remove('match-animate');
            }, { once:true });
        }
    });
}*/

//listener for button
button.addEventListener('click', onButtonClick);
buttonStay.addEventListener('click', onStayClick);

//Initialize First Round
resetGame();

