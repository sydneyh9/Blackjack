//my card deck
let cards = [11,2,3,4,5,6,7,8,9,10,10,10,10];

let dealer_choices = [0,1];
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
const dealerfirstcard = document.getElementById('dealer_first_card');
const dealerscore = document.getElementById('dealer_score');
const winorlose = document.getElementById('win_or_lose');

//resetting game function for every new round
function resetGame() {
    cards = [11,2,3,4,5,6,7,8,9,10,10,10];
    your_cards = [];
    dealer_cards = [];
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
    }
    updateDisplay();
}

//dealer continues to hit until they hit a score of >= 17
function dealerTurn() {
    blackjackState = "dealer-turn";
    button.disabled = true;
    buttonStay.disabled = true;
    dealer_score = dealer_cards.reduce((a,b) => a + b, 0);
    
    function dealerDraw() {
        if(dealer_score < 17) {
            let card = draw();
            dealer_cards.push(card);
            dealer_score += card;
            updateDisplay(true);

            //setting the drawing the next card for a 1 second delay
            setTimeout(dealerDraw, 1000);
        } else {
            if (dealer_score > 21 && current_score > 21) {
                if (current_score < dealer_score) {
                    win_or_lose = "You both went over but you have the better hand! You win!";
                }
                else if (current_score > dealer_score) {
                    win_or_lose = "You both went over but the dealer has the better hand! Dealer wins.";
                }
            }
            else if (dealer_score > 21 && current_score <= 21) {
                win_or_lose = "Dealer went over. You win!";
            } else if (current_score > 21 && dealer_score <= 21) {
                win_or_lose = "You went over! Dealer wins.";
            } else if (dealer_score === current_score) {
                win_or_lose = "Looks like you tied. It's a draw.";
            } else if (current_score == 21) {
                win_or_lose = "A perfect 21. You win!";
            }  else if (dealer_score > current_score) {
                win_or_lose = "Oh no! The dealer has a better hand. Dealer wins.";
            } else {
                win_or_lose = "You have a better hand! You win!";
            }
            blackjackState = "done";
            button.textContent = "Restart";
            updateDisplay(true);

        }
    }
    dealerDraw();

}
//updating the display 
function updateDisplay(showDealer = false) {
    yourcards.textContent = `Your Cards: ${your_cards.join(',')}`;
    currentscore.textContent = `Current Score: ${current_score}`;
    if (showDealer) {
        dealerfirstcard.textContent =  `Dealer's Cards: ${dealer_cards.join(', ')}`;
        dealerscore.textContent = `Dealer's Score: ${dealer_score}`;
    } else {
        dealerfirstcard.textContent = `Dealer's First Card: ${dealer_first_card}`;
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
    resetGame();
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
        updateDisplay();
    }
}


//listener for button
button.addEventListener('click', onButtonClick);
buttonStay.addEventListener('click', onStayClick);

//Initialize First Round
resetGame();

