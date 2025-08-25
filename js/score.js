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