//score.js
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

export function calculateGameResult(currentScore, dealerScore, settingsManager, endRound) {
    if (dealerScore > 21 && currentScore > 21) {
        if (currentScore < dealerScore) {
            endRound(settingsManager.t('bothOverPlayerWins'));
        } else {
            endRound(settingsManager.t('bothOverDealerWins'));
        }
    } else if (dealerScore > 21 && currentScore <= 21) {
        endRound(settingsManager.t('dealerOver21'));
    } else if (currentScore > 21 && dealerScore <= 21) {
        endRound(settingsManager.t('over21'));
    } else if (dealerScore === currentScore) {
        endRound(settingsManager.t('tie'));
    } else if (currentScore == 21) {
        endRound(settingsManager.t('perfect21'));
    }  else if (dealerScore > currentScore) {
        endRound(settingsManager.t('dealerWins'));
    } else {
        endRound(settingsManager.t('playerWins'));
    }
}