//deck.js

export function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = [
        { rank: 'A', value: 11 },
        { rank: '2', value: 2 },
        { rank: '3', value: 3 },
        { rank: '4', value: 4 },
        { rank: '5', value: 5 },
        { rank: '6', value: 6 },
        { rank: '7', value: 7 },
        { rank: '8', value: 8 },
        { rank: '9', value: 9 },
        { rank: '10', value: 10 },
        { rank: 'J', value: 10 },
        { rank: 'Q', value: 10 },
        { rank: 'K', value: 10 }
    ];
    const newDeck = [];
    //deck is now constructed of suits and ranks like typical blackjack
    for (let suit of suits) {
        for (let rankObject of ranks) {
            newDeck.push({
                suit: suit,
                rank: rankObject.rank,
                value: rankObject.value
            });
        }
    }
    return newDeck;
}

export function draw(deck) {
    if (deck.length === 0) {
        return null;
    }
    const index = Math.floor(Math.random() * deck.length);
    return deck.splice(index, 1)[0];
}