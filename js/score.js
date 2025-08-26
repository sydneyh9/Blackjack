
/* 
 * Calculates the total score for one hand, changes Aces from 11 to 1 based on what is needed by the individual
 @param {Array} hand - Array of card objects with {rank, suit, value}
  * @returns {number} - The calculated hand score
*/
 
//function for handling whether the Ace is treated as a 1 or 11 value      
export function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    for (let card of hand) {
        score += card.value;
        if (card.rank === 'A') {
            aces++;
        }
    }
    //If the score is over 21, treat it as a 1
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

/* Determines the result of the round based on the player's and dealer's scores 
* @param {number } currentScore
* @param {number} dealerScore
* @returns {string} - The result message
*/

export function calculateGameResult(currentScore, dealerScore) {
    if (dealerScore > 21 && currentScore > 21) {
        if (currentScore < dealerScore) {
            return("You both went over but you have the better hand! You win!");
        } else {
            return("You both went over but the dealer has the better hand! Dealer wins.");
        }
    } else if (dealerScore > 21 && currentScore <= 21) {
        return("Dealer went over. You win!");
    } else if (currentScore > 21 && dealerScore <= 21) {
        return("You went over! Dealer wins.");
    } else if (dealerScore === currentScore) {
        return("Looks like you tied. It's a draw.");
    } else if (currentScore == 21) {
        return("A perfect 21. You win!");
    }  else if (dealerScore > currentScore) {
        return("Oh no! The dealer has a better hand. Dealer wins.");
    } else {
        return("You have a better hand! You win!");
    }
}