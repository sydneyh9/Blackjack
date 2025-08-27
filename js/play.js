import { calculateScore, calculateGameResult } from "./score.js";
import {initialAudioSettings} from './settings.js';
document.addEventListener('DOMContentLoaded', () => {
    const countdown = document.getElementById('countdown');
    //basic game elements declarations
    const gameInformation = document.getElementById('game_information');
    const turn = document.getElementById('turn');
    //establish button for dealing the cards
    const button = document.getElementById('deal');
    const buttonStay = document.getElementById('stay');
    const yourcards = document.getElementById('your_cards');
    const currentscore = document.getElementById('current_score');
    const dealercards = document.getElementById('dealer_cards');
    const dealerscore = document.getElementById('dealer_score');
    const winorlose = document.getElementById('win_or_lose');
    const instructionsOverlay = document.getElementById('instructions-overlay');
    const closeInstructionsButton = document.getElementById('close-instructions');

    button.classList.add('centered');
    
    //show theh instructions when the page loads
    instructionsOverlay.style.display = 'flex';

    //hide it when the user clicks the close button
    closeInstructionsButton.addEventListener('click', () => {
        instructionsOverlay.style.display = 'none';
    });

    //when clicking help button, open instructions
    document.getElementById("help-button").addEventListener("click", () => {
        const instructions = document.getElementById("instructions-overlay");
        if (instructions) {
            instructions.style.display = instructions.style.display === "flex" ? "none" : "flex";
        }
    });

    //initial audio and settings logic
    initialAudioSettings();
    //if the user clicks outside of the instructions, it disappears and goes back to main game
    //if user clicks outside of the settings box, it disappears and goes back to main game
    instructionsOverlay.addEventListener('click', (event) => {
        const instructionsBox = document.querySelector('.instructions-box');
        if(instructionsOverlay.style.display === 'flex' && !instructionsBox.contains(event.target)) {
            instructionsOverlay.style.display = 'none';
        }
    });

    document.getElementById("settings-button").addEventListener("click", () => {
        const overlay = document.getElementById("settings-overlay");
        overlay.classList.toggle("show");
    });

    document.getElementById("settings-overlay").addEventListener("click", (e) => {
        if (e.target.id === "settings-overlay") {
            e.target.classList.remove("show");
        }
    });

    let cards = [];
    let your_cards = [];
    let playerStay = false;
    let dealer_cards = [];
    let current_score = 0;
    let dealer_score = 0;
    let win_or_lose = "";
    let blackjackState = "start";

    function endRound(message) {
        win_or_lose = message;
        blackjackState = "done";
        button.setAttribute('data-label', 'Restart');
        button.disabled = false;
        buttonStay.disabled = true;
        updateDisplay(true, false);
    }

    function startCountDown() {
        let timeLeft = 3;
        countdown.textContent = `${timeLeft}`;
        countdown.style.visibility = 'visible';
        countdown.style.opacity = '0.6';

        button.disabled = true;
        console.log("Disabling button for countdown");
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
                    if (gameInformation) {
                        console.log("Game information visible");
                        gameInformation.style.visibility = 'visible';
                    }

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
    //my card deck
    function createDeck() {
        //funtion to create a new deck out of the following values to use for a new round
        //modified: deck now includes ranks and suits
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
        let newDeck = [];
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

    //draw card from the deck function
    //pulls a random card from the pile and removes it from the deck as per house rules
    function draw() {
        if (cards.length === 0) {
            return null;
        }
        let index = Math.floor(Math.random() * cards.length);
        return cards.splice(index, 1)[0];
    }


        //resetting game function for every new round
        function resetGame(isRestart = true) {
            const gameInformation = document.getElementById('game_information');
            if (isRestart) {
                if(gameInformation) gameInformation.style.visibility = 'hidden';
                const scoreBox = document.getElementById('score-box');
                if (scoreBox) scoreBox.style.display = 'none';
                const resultBox = document.getElementById('result-box');
                if (resultBox) resultBox.style.display = 'none';
                const cardLabels = document.querySelectorAll('.card-label');
                cardLabels.forEach(label => {
                    label.style.display = 'none';
                });
            }
        cards = createDeck();
        your_cards = [];
        dealer_cards = [];
        first_card = 0;
        second_card = 0;
        dealer_first_card = 0;
        playerStay = false;
        dealerStay = false;
        toggleMusicButton.disabled = true;
        toggleSoundEffectButton.disabled = true;
        dealer_second_card = 0;
        current_score = 0;
        dealer_score = 0;
        win_or_lose = "";
        blackjackState = "start";

        if (yourcards) yourcards.innerHTML = "";
        if (dealercards) dealercards.innerHTML = "";
        if (currentscore) currentscore.textContent = "";
        if (dealerscore) dealerscore.textContent = "";
        if (winorlose) {
            winorlose.textContent = "";
        }
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
        startCountDown();
    }

    //pulls new cards
    function drawCard() {
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
            playerStay = true;
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

        if (blackjackState === "done" || dealerStay) return;
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
    function finalizeDealerTurn() {
        dealer_score = calculateScore(dealer_cards);

        updateDisplay(true,true);

        const dealerCardElement = dealercards.querySelectorAll('.card');
        const firstDealerCard = dealerCardElement[0];
        
        if (firstDealerCard) {
                firstDealerCard.classList.remove('flipped');
                setTimeout(() => {
                    const resultMessage = calculateGameResult(current_score, dealer_score);
                    endRound(resultMessage);
                }, 650);
        } else {
            const resultMessage = calculateGameResult(current_score, dealer_score);
            endRound(resultMessage);
        }
    }

    //updating the display 
    function updateDisplay(showDealer = false, animate = false) {
        //empty container to house cards animation
        yourcards.innerHTML = '';

        const suitSymbols = {
            'Hearts': '♥️',
            'Diamonds': '♦️',
            'Clubs': '♣️',
            'Spades': '♠️'
        };

        //create the cards based on what is drawn
        your_cards.forEach((card, index) => {
            //container for card
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            //creation of card
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            //card text
            const front = document.createElement('div');
            front.className = 'card-front';

            const suitSymbol = suitSymbols[card.suit];
            const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';

            front.innerHTML = `
            <div class="card-corner top-left"> ${card.rank} <br> ${suitSymbol}</div>
            <div class="card-center"> ${suitSymbol}</div>
            <div class="card-corner bottom-right"> ${card.rank}<br> ${suitSymbol}</div>`;

            front.classList.add(isRed ? 'red-card' : 'black-card');

            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = '?';

            cardElement.appendChild(front);
            cardElement.appendChild(back);
            cardContainer.appendChild(cardElement);
            if (animate && index === your_cards.length - 1) {
                cardContainer.classList.add('swipe-in');
                cardContainer.addEventListener('animationend', () => {
                    cardContainer.classList.remove('swipe-in');
                }, { once: true });
            }
            yourcards.appendChild(cardContainer);
        });
        current_score = calculateScore(your_cards);
        currentscore.textContent = `Current Score: ${current_score}`;
        //empty container to house dealer cards animation
        dealercards.innerHTML = '';
        if (dealer_cards.length === 0) {
            dealerscore.textContent = "";
        } else if (showDealer && blackjackState === "done") {
            dealer_cards.forEach((card, index) => {
                const cardContainer = document.createElement('div');
                //only plays if we're not finished the round
                cardContainer.className = 'card-container';
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                //card front
                const front = document.createElement('div');
                front.className = 'card-front';
            
                const suitSymbol = suitSymbols[card.suit];
                const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';

                front.innerHTML = `
                <div class="card-corner top-left"> ${card.rank} <br> ${suitSymbol}</div>
                <div class="card-center"> ${suitSymbol}</div>
                <div class="card-corner bottom-right"> ${card.rank}<br> ${suitSymbol}</div>`;

                front.classList.add(isRed ? 'red-card' : 'black-card');
                //card back
                const back = document.createElement('div');
                back.className = 'card-back';
                back.textContent = '?';
                cardElement.appendChild(front);
                cardElement.appendChild(back);
                cardContainer.appendChild(cardElement);
                if(animate && index === dealer_cards.length - 1 && blackjackState === "dealer-turn" && blackjackState !== "done") {
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

            //after the dealer's turn is over, show the first card
            if (blackjackState === "done") {
                const dealerCardElements = dealercards.querySelectorAll('.card');
                const firstDealerCard = dealerCardElements[0];
                if (firstDealerCard) {
                    firstDealerCard.classList.remove('flipped'); ///reveal the first card
                }
            }
            //calculate and display dealer's score
            dealer_score = calculateScore(dealer_cards);
            dealerscore.textContent = `Dealer's Score: ${dealer_score}`;
        } else {

            //creates dealer cards images and only shows the second card onward
            dealer_cards.forEach((card, index) => {
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';
                const cardElement = document.createElement('div');
                cardElement.className = 'card';

                const front = document.createElement('div');
                front.className = 'card-front';
            
                const suitSymbol = suitSymbols[card.suit];
                const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';

                front.innerHTML = `
                <div class="card-corner top-left"> ${card.rank} <br> ${suitSymbol}</div>
                <div class="card-center"> ${suitSymbol}</div>
                <div class="card-corner bottom-right"> ${card.rank}<br> ${suitSymbol}</div>`;

                front.classList.add(isRed ? 'red-card' : 'black-card');

                const back = document.createElement('div');
                back.className = 'card-back';
                back.textContent = '?';

                cardElement.appendChild(front);
                cardElement.appendChild(back);
            
                //if it's the dealer's turn, do the same to its animations

                cardContainer.appendChild(cardElement);
                if (index == 0) {
                    cardElement.classList.add('flipped');
                }
                if (animate) {
                    cardContainer.classList.add('swipe-in');
                    cardContainer.addEventListener('animationend', () => {
                        cardContainer.classList.remove('swipe-in');
            }, {once:true});
        } 
            dealercards.appendChild(cardContainer);
        });
            //hides the first card in the dealer's cards from the player
            const visibleCards = dealer_cards.slice(1);
            const visibleScore = calculateScore(visibleCards);
            dealerscore.textContent = `Dealer's Score: ? + ${visibleScore}`;
        }
        winorlose.textContent = win_or_lose ? `${win_or_lose}` : '';

        if (turn) {
            if (blackjackState === "in-game") {
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
        //if the sound effects are enabled, fun wheel spin sound for buttons
        if (soundEffectEnabled) {
            buttonSound.play().catch(err => {
                console.log("Failed to play button sound:", err);
            });
        }
        //fun spin animation for when buttons are clicked
        button.classList.add('spin');
        button.addEventListener('animationend', () => {
            button.classList.remove('spin');
        }, { once: true });

        if(blackjackState === "start") {
            startCountDown();
        } else if (blackjackState === "in-game") {
            drawCard();
        } else if (blackjackState === "done") {
            resetGame(true);
        }
    }

    //function for the player to have a stay option
    function onStayClick() {
        //if sound effects enabled, fun wheel spin sound for buttons
        if (soundEffectEnabled) {
            buttonSound.play().catch(err => {
                console.log("Failed to play button sound:", err);
            });
        }
        //fun spin animation for when buttons are clicked
        buttonStay.classList.add('spin');
        buttonStay.addEventListener('animationend', () => {
            buttonStay.classList.remove('spin');
        }, { once: true });
        console.log("Stay clicked, state is:", blackjackState);
        if (blackjackState === "in-game") {
            playerStay = true;
            dealerTurn();
        }
    }

    //function for the player clicking settings
    function onSettingsClick() {
        settingsButton.classList.add('spin');
        settingsButton.addEventListener('animationend', () => {
            settingsButton.classList.remove('spin');
        }, { once: true});
    }

    //function for starting the game
    function startGame() {
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
        if(resultBox) {
            console.log("Result box displayed");
            resultBox.style.display = 'block' ;
        }
        const scoreBox = document.getElementById('score-box');
        if(scoreBox) {
            console.log("Score box displayed");
            scoreBox.style.display = 'block';
        }
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
        current_score = calculateScore(your_cards);
        console.log(current_score);

        updateDisplay(false, true);

    }

    //listener for button
    button.addEventListener('click', onButtonClick);
    buttonStay.addEventListener('click', onStayClick);
    settingsButton.addEventListener('click', onSettingsClick);

    //Initialize First Round
    resetGame();

});