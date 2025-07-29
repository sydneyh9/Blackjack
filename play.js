//my card deck
let cards = [11,2,3,4,5,6,7,8,9,10,10,10,10];

let dealer_choices = [0,1];
let your_cards = [];
let dealer_cards = [];
let dealer_first_card = 0;
let first_card = 0;
let second_card = 0;
let current_score = 0;
let dealer_score = 0;
let dealer_choice = 0;
let final_hand = "";
let computer_final_hand = "";

//the dealer gets their cards
let dealer_index1 = Math.floor(Math.random() * cards.length);
dealer_first_card = cards[dealer_index1];
cards.splice(dealer_index1,1);
let dealer_index2 = Math.floor(Math.random() * cards.length);
dealer_second_card = cards[dealer_index2];
cards.splice(dealer_index2,1);
dealer_cards.push(dealer_first_card, dealer_second_card);

//you get your cards
let random_index1 = Math.floor(Math.random() * cards.length);
first_card = cards[random_index1];
cards.splice(random_index1, 1);
let random_index2 = Math.floor(Math.random() * cards.length);
second_card = cards[random_index2];
cards.splice(random_index2, 1);
your_cards.push(first_card, second_card);

current_score = first_card + second_card;
console.log("Your cards:", your_cards);
console.log("Current Score:", current_score);
