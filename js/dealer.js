import {draw} from './deck.js';
import {dealer_cards, blackjackState, playerStay, dealerStay} from './gameState.js';
import {calculateScore} from './score.js';
import {updateDisplay} from './display.js';
import {finalizeDealerTurn, endRound} from './gameEvents.js';

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
