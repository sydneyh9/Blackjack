import {draw} from './deck.js';
import {your_cards, dealer_cards, current_score, dealer_score, playerStay, blackjackState, win_or_lose} from './gameState.js';
import {calculateScore} from './score.js';
import { updateDisplay} from './display.js';

//pulls new cards
export function drawCard() {
    if (blackjackState !== "in-game") {
        return;
    }
    let newCard = draw();
    if (!newCard) {
        return;
    }
    your_cards.push(newCard);
    current_score = calculateScore(your_cards);
    if (current_score > 21) {
        //end the round and reveal the dealer's cards
        endRound("You went over. You Lose!");
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
export function dealerTurn(button, buttonStay) {

    if (blackjackState === "done") return;
    blackjackState = "dealer-turn";
    button.disabled = true;
    buttonStay.disabled = true;
    
    //add up the dealer_score
    dealer_score = calculateScore(dealer_cards);
    //if the dealer's score is less than 17, it'll automatically draw another card

     if(dealer_score < 17) {
            let card = draw();
            dealer_cards.push(card);
            //update the display for the dealer cards
            updateDisplay(true,true);
            //animate and then continue dealer turn
            //waits before the player gets their turn again to reduce abruptness
            setTimeout(() => {
                dealerTurn(); //continue dealer's turn
            }, 1000); //delay next card draw by a second
    } else {
        dealerStay = true;
        if (playerStay) {
            finalizeDealerTurn(); //both stayed, so calculate the results
        } else {
                blackjackState = "in-game";
                button.disabled = false;
                buttonStay.disabled = false;
                updateDisplay(blackjackState === "done", false);
        }
    }
}

//play the dealer card draw animation
//setting the drawing the next card for a 2 second delay
export function finalizeDealerTurn() {
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

export function calculateGameResult() {
    if (dealer_score > 21 && current_score > 21) {
        if (current_score < dealer_score) {
            endRound("You both went over but you have the better hand! You win!");
        } else {
            endRound("You both went over but the dealer has the better hand! Dealer wins.");
        }
    } else if (dealer_score > 21 && current_score <= 21) {
        endRound("Dealer went over. You win!");
    } else if (current_score > 21 && dealer_score <= 21) {
        endRound("You went over! Dealer wins.");
    } else if (dealer_score === current_score) {
        endRound("Looks like you tied. It's a draw.");
    } else if (current_score == 21) {
        endRound("A perfect 21. You win!");
    }  else if (dealer_score > current_score) {
        endRound("Oh no! The dealer has a better hand. Dealer wins.");
    } else {
        endRound("You have a better hand! You win!");
    }
}

export function endRound(message) {
    win_or_lose = message;
    blackjackState = "done";
    button.setAttribute('data-label', 'Restart');
    button.disabled = false;
    buttonStay.disabled = true;
    updateDisplay(true, false);
}


export function startCountDown() {
    let timeLeft = 3;
    countdown.textContent = `${timeLeft}`;
    countdown.style.visibility = 'visible';
    countdown.style.opacity = '0.6';

    button.disabled = true;
    buttonStay.disabled = true;

    //buttons shouldn't be available during countdown
    button.style.display = 'none';
    buttonStay.style.display = 'none';

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

                //show and center deal button after countdown finishes
                button.style.display = 'inline-block';
                buttonStay.style.display = 'inline-block';
                button.classList.add('centered');
                button.disabled = false;
                buttonStay.disabled = false;
                //start the game and undisable the buttons
                startGame();
            }, 300);
        }, 1000);
    }
    }, 1000);
}

//function for starting the game
export function startGame() {
    if (musicEnabled) {
        backgroundMusic.play().catch(err => {
            console.log("Background music is not playing: ", err);
        });
    } else {
        backgroundMusic.pause();
    }

    if (soundEffectEnabled) {
        casino.play().catch(err => {
            console.log("Background ambience is not playing: ", err);
        });
    } else {
        casino.pause();
    }
    const resultBox = document.getElementById('result-box');
    if(resultBox) resultBox.style.display = 'block';
    const scoreBox = document.getElementById('score-box');
    if(scoreBox) scoreBox.style.display = 'block';
    const cardLabels = document.querySelectorAll('.card-label');
    cardLabels.forEach(label => {
        label.style.display = 'block';
    });
    blackjackState = "in-game";
    button.setAttribute('data-label', 'Deal');
    button.disabled = false;
    buttonStay.disabled = false;
    toggleMusicButton.disabled = false;
    toggleSoundEffectButton.disabled = false;
    button.classList.remove('centered');
    buttonStay.style.visibility = 'visible';
    //the dealer gets their cards
    //you get your cards
    dealer_cards.push(draw(), draw());
    your_cards.push(draw(), draw());

    //update scores
    current_score = first_card + second_card;

    updateDisplay(false, true);

}
