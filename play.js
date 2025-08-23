document.addEventListener('DOMContentLoaded', () => {
    const countdown = document.getElementById('countdown');
    //basic game elements declarations
    const gameInformation = document.getElementById('game_information');
    const scoreBox = document.querySelector('.score-box');
    const cardLabels = document.querySelectorAll('.card-label');
    const turn = document.getElementById('turn');
    //establish button for dealing the cards
    const button = document.getElementById('deal');
    const buttonStay = document.getElementById('stay');
    const yourcards = document.getElementById('your_cards');
    const currentscore = document.getElementById('current_score');
    const dealercards = document.getElementById('dealer_cards');
    const dealerfirstcard = document.getElementById('dealer_first_card');
    const dealerscore = document.getElementById('dealer_score');
    const winorlose = document.getElementById('win_or_lose');
    const buttonSound = document.getElementById('button-sound');
    const backgroundMusic = document.getElementById('background-music');
    const backgroundMusicSecond = document.getElementById('background-music-second');
    const casino = document.getElementById('casino');
    const toggleMusicButton = document.getElementById('toggle-music');
    const toggleSoundEffectButton = document.getElementById('toggle-sound-effect');
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');

    //toggle visibility of the settings menu
    settingsButton.addEventListener('click', () => {
        settingsMenu.classList.toggle('show');
    });

    //if user clicks outside of the settings box, it disappears and goes back to main game
    document.addEventListener('click', (event) => {
        if (!settingsButton.contains(event.target) && !settingsMenu.contains(event.target)) {
            settingsMenu.classList.remove('show');
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

    //making sure I don't play both at once
    backgroundMusicSecond.pause();
    backgroundMusicSecond.currentTime = 0;

    let musicEnabled = true;
    let soundEffectEnabled = true;

    //if the first track is finished, play the second one
    backgroundMusic.addEventListener('ended', () => {
        if (musicEnabled) {
            backgroundMusicSecond.currentTime = 0;
            backgroundMusicSecond.play();
        }
    });
    //loop these two tracks
    backgroundMusicSecond.addEventListener('ended', () => {
        if (musicEnabled) {
            backgroundMusic.currentTime = 0;
            backgroundMusic.play();
        }})

    //buttons for the user to turn off music and ambience if they want
    toggleMusicButton.addEventListener('click', () => {

        //don't allow toggling music before the game starts 
        if (blackjackState === "start") {
            console.log("Music can't be toggled until the game starts.");
            return;
        }
        musicEnabled = !musicEnabled;

        toggleMusicButton.classList.toggle('active', musicEnabled);
        toggleMusicButton.classList.toggle('glow', musicEnabled);
        toggleMusicButton.setAttribute('aria-pressed', musicEnabled);
        updateToggleButtonsGlow();
        if (musicEnabled) {
            if (backgroundMusic.currentTime > 0 && !backgroundMusic.ended) {
                backgroundMusic.play(); 
            } else if (backgroundMusicSecond.currentTime > 0 && !backgroundMusicSecond.ended) {
                backgroundMusicSecond.play();
            } else {
                backgroundMusic.currentTime = 0;
                backgroundMusic.play();
            }
            toggleMusicButton.textContent = "Music On";
            casino.play();
        } else {
            backgroundMusic.pause();
            backgroundMusicSecond.pause();
            casino.pause();
            toggleMusicButton.textContent = "Music Off";
        }
    });
    toggleSoundEffectButton.addEventListener('click', () => {
        soundEffectEnabled = !soundEffectEnabled;

        toggleSoundEffectButton.classList.toggle('active', soundEffectEnabled);
        toggleSoundEffectButton.classList.toggle('glow', soundEffectEnabled);
        toggleSoundEffectButton.setAttribute('aria-pressed', soundEffectEnabled);
        updateToggleButtonsGlow();
        toggleSoundEffectButton.textContent = soundEffectEnabled ? "Sound Effects On" : "Sound Effects Off";

        if (soundEffectEnabled) {
            casino.play().catch(err => {
                console.log("Failed to play casino ambience:", err);
            });
        } else {
            casino.pause();
        }
    });

    function updateToggleButtonsGlow() {
        toggleMusicButton.classList.toggle('glow', !toggleMusicButton.disabled && musicEnabled);
        toggleSoundEffectButton.classList.toggle('glow', !toggleSoundEffectButton.disabled && soundEffectEnabled);
        settingsButton.classList.toggle('glow', !settingsButton.disabled);
    }
    let cards = [];
    let your_cards = [];
    let playerStay = false;
    let dealerStay = false;
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
let dealer_first_card = 0;
let dealer_second_card = 0;
let first_card = 0;
let second_card = 0;


//resetting game function for every new round
function resetGame() {
    const scoreBox = document.querySelector('.score-box');
    if (scoreBox) scoreBox.style.display = 'none';
    const cardLabels = document.querySelectorAll('.card-label');
    cardLabels.forEach(label => {
        label.style.display = 'none';
    });
    const gameInformation = document.getElementById('game_information');
    if(gameInformation) gameInformation.style.visibility = 'hidden';
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
    updateToggleButtonsGlow();
    dealer_second_card = 0;
    current_score = 0;
    dealer_score = 0;
    win_or_lose = "";
    button.classList.add('centered');
    blackjackState = "start";

    if (yourcards) yourcards.innerHTML = "";
    if (dealercards) dealercards.innerHTML = "";
    if (currentscore) currentscore.textContent = "";
    if (dealerfirstcard) dealerfirstcard.textContent = "";
    if (dealerscore) dealerscore.textContent = "";
    if (winorlose) winorlose.textContent = "";
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
    if (blackjackState !== "in-game") {
        return;
    }
    let newCard = draw();
    your_cards.push(newCard);
    current_score += newCard;
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
function dealerTurn() {

    if (blackjackState === "done") return;
    blackjackState = "dealer-turn";
    button.disabled = true;
    buttonStay.disabled = true;
    
    //add up the dealer_score
    dealer_score = dealer_cards.reduce((a,b) => a + b, 0);
    //if the dealer's score is less than 17, it'll automatically draw another card
     if(dealer_score < 17) {
        let card = draw();
        dealer_cards.push(card);
        //update the display for the dealer cards
        updateDisplay(true,true);
        //animate and then continue dealer turn
        //waits before the player gets their turn again to reduce abruptness
        setTimeout(() => {
            if (!playerStay) {
                blackjackState = "in-game";
                button.disabled = false;
                buttonStay.disabled = false;
                updateDisplay(blackjackState === "done", false);
            } else {
                //continue to have the dealer draw until they hit >= 17
                dealerTurn();
            }
            }, 1000);
    } else {
        //when the dealer is done drawing and player is done drawing, calculate result
        dealerStay = true;
        if (playerStay) {
            finalizeDealerTurn();
        } else {
            blackjackState = "in-game";
            button.disabled = false;
            buttonStay.disabled = false;
            updateDisplay(true, false);
        }
    }
}

            //play the dealer card draw animation
            //setting the drawing the next card for a 2 second delay
        function finalizeDealerTurn() {
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

        function calculateGameResult() {
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
            
//updating the display 
function updateDisplay(showDealer = false, animate = false) {
    //empty container to house cards animation
    yourcards.innerHTML = '';
    //create the cards based on what is drawn
    your_cards.forEach((cardValue, index) => {
        //container for card
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        //creation of card
        const card = document.createElement('div');
        card.className = 'card';
        //card text
        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = cardValue;

        const back = document.createElement('div');
        back.className = 'card-back';
        back.textContent = '?';

        card.appendChild(front);
        card.appendChild(back);
        cardContainer.appendChild(card);
        if (animate && index === your_cards.length - 1) {
            cardContainer.classList.add('swipe-in');
            cardContainer.addEventListener('animationend', () => {
                cardContainer.classList.remove('swipe-in');
            }, { once: true });
        }
        yourcards.appendChild(cardContainer);
    });
    currentscore.textContent = `Current Score: ${current_score}`;
    //empty container to house dealer cards animation
    dealercards.innerHTML = '';
    if (dealer_cards.length === 0) {
        dealerscore.textContent = "";
    } else if (showDealer) {
        dealer_cards.forEach((cardValue, index) => {
            const cardContainer = document.createElement('div');
            //only plays if we're not finished the round
            cardContainer.className = 'card-container';
            const card = document.createElement('div');
            card.className = 'card';
            //card front
            const front = document.createElement('div');
            front.className = 'card-front';
            front.textContent = cardValue;
            //card back
            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = '?';
            card.appendChild(front);
            card.appendChild(back);
            cardContainer.appendChild(card);
            if(animate && dealer_cards.length - 1 && (blackjackState === "dealer-turn" || blackjackState === "in-game" && dealer_cards.length === 2)) {
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
        dealer_score = dealer_cards.reduce((a,b) => a + b, 0);
        dealerscore.textContent = `Dealer's Score: ${dealer_score}`;
    } else {

        //creates dealer cards images
        dealer_cards.forEach((cardValue, index) => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            const card = document.createElement('div');
            card.className = 'card';

            const front = document.createElement('div');
            front.className = 'card-front';
            front.textContent = cardValue;

            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = '?';

            card.appendChild(front);
            card.appendChild(back);
            
            //if it's the dealer's turn, do the same to its animations

            cardContainer.appendChild(card);

            if (index == 0) {
                //only reveal the dealer's card once the round is done
                if (blackjackState === "done") {
                    card.classList.remove('flipped');
            } else {
                card.classList.add('flipped');
            }
        } else {
            card.classList.remove('flipped');
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
        const visibleScore = visibleCards.reduce((a,b) => a + b, 0);
        //dealerfirstcard.textContent = `Dealer's Cards: ?, ${visibleCards.join(',')}`;
        dealerscore.textContent = `Dealer's Score: ??? + ${visibleScore}`;
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
        resetGame();
        startCountDown();
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
    backgroundMusic.play().catch(err => {
        console.log("Background music is not playing: ", err);
    });
    casino.play().catch(err => {
        console.log("Background ambience is not playing: ", err);
    });
    const scoreBox = document.querySelector('.score-box');
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
    updateToggleButtonsGlow();
    button.classList.remove('centered');
    buttonStay.style.visibility = 'visible';
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

    updateDisplay(false, true);

    //win or lose skeleton
    if (current_score > 21) {
        win_or_lose = "You went over. You lose!";
        blackjackState = "done";
        button.setAttribute('data-label', 'Deal');
        buttonStay.disabled = true;
        updateDisplay(true, true);
    }
}

//listener for button
button.addEventListener('click', onButtonClick);
buttonStay.addEventListener('click', onStayClick);
settingsButton.addEventListener('click', onSettingsClick);

//Initialize First Round
resetGame();

});