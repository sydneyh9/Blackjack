//play.js
import { draw, createDeck } from './deck.js';
import { playButtonSound, startGameAudio } from './audio.js';
import { UserManager } from './user.js';
import { InstructionsManager } from './instructions.js';
import {SettingsManager} from './settings.js';
import { calculateGameResult, calculateScore } from './score.js';
import {applyTooltips} from './tooltips.js';
document.addEventListener('DOMContentLoaded', () => {
    const userManager = new UserManager((key) => settingsManager.t(key));
    let currentUser = null;
    const instructionsManager = new InstructionsManager();
    const settingsManager = new SettingsManager();

    //refresh UI for screen readers
    settingsManager.onScreenReaderToggle = (enabled) => {
        updateDisplay(true, false);
    };

    //screen reader 
    function speak(text) {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = settingsManager.currentLanguage === 'es' ? 'es-ES' :
        settingsManager.currentLanguage === 'fr' ? 'fr-FR' : 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === utterance.lang);
        if (voice) {
            utterance.voice = voice;
        }
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }

    const loginContainer = document.getElementById('login-container');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username-input');
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuOverlay = document.getElementById('user-menu-overlay');
    const closeUserMenu = document.getElementById('close-user-menu');
    const userWinStreak = document.getElementById('user-win-streak');
    const userHistory = document.getElementById('user-history');
    const logoutButton = document.getElementById('logout-button');
    const hamburgerButton = document.getElementById('hamburger-button');
    const sideMenu = document.getElementById('side-menu');
    const passwordInput = document.getElementById('password-input');
    const signupButton = document.getElementById('signup-button');

    //SignUp
    signupButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const result = userManager.signup(username, password);
        alert(result.message);
    });

    hamburgerButton.addEventListener('click', () => {
        sideMenu.classList.toggle('show');
    });

    //login/logout logic
    loginButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const result = userManager.login(username, password);
        if(result.success) {
            currentUser = username;
            loginContainer.style.display  = 'none';
            userMenuButton.style.display = 'inline-block';
            userMenuButton.setAttribute('data-label', username);
            alert(result.message);
        } else {
            alert(result.message);
        }
    });

    logoutButton.addEventListener("click", () => {
        userManager.logout();
        currentUser = null;

        //hide user menu & button
        userMenuOverlay.style.display = "none";
        userMenuButton.style.display = "none";
        logoutButton.style.display = "none";
        loginContainer.style.display = "block";
        //show login again
        document.getElementById('login-container').style.display = "block";

        alert(settingsManager.t('logoutMessage'));
    });


    function refreshUserMenu() {
        if (!currentUser) return;
        const scores = userManager.getUserScores(currentUser);
        const streak = userManager.getWinStreak(currentUser);

        userWinStreak.textContent = `${settingsManager.t('winStreak')}: ${streak}`;
        userHistory.innerHTML = "";

        scores.slice().reverse().forEach(s => {
            const li = document.createElement("li");
            const template = settingsManager.t('historyEntry');
            const formatted = template.replace('{time}', new Date(s.timestamp).toLocaleString()).replace('{result}', s.result).replace('{player}', s.playerScore).replace('{dealer}', s.dealerScore);
            li.textContent = formatted;
            userHistory.appendChild(li);
        });
    }

    userMenuButton.addEventListener("click", () => {
        refreshUserMenu();
        userMenuOverlay.style.display = "flex";
    });

    closeUserMenu.addEventListener("click", () => {
        userMenuOverlay.style.display = "none";
    });

    //close the user menu when clicking the overlay
    document.getElementById('user-menu-overlay').addEventListener('click',function(e) {
        if (e.target === this) {
            this.style.display = "none";
        }
    });


    let cards = [];
    let your_cards = [];
    let dealer_cards = [];
    let current_score = 0;
    let dealer_score = 0;
    let win_or_lose = "";
    let blackjackState = "start";
    let playerStay = false;
    let dealerStay = false;
    const countdown = document.getElementById('countdown');
    //basic game elements declarations
    const gameInformation = document.getElementById('game_information');
    const toggleMusicButton = document.getElementById('toggle-music');
    const toggleSoundEffectButton = document.getElementById('toggle-sound-effect');
    const turn = document.getElementById('turn');
    //establish button for dealing the cards
    const button = document.getElementById('deal');
    const buttonStay = document.getElementById('stay');
    const yourcards = document.getElementById('your_cards');
    const currentscore = document.getElementById('current_score');
    const dealercards = document.getElementById('dealer_cards');
    const dealerscore = document.getElementById('dealer_score');
    const winorlose = document.getElementById('win_or_lose');

    button.classList.add('centered');

    function announceAction(message) {
        if (!settingsManager.screenReaderEnabled) return;
        const announcer = document.getElementById('sr-announcer');
        announcer.textContent = '';
        setTimeout(() => { announcer.textContent = message; speak(message)}, 50);
    }

    turn.addEventListener('languageChanged', () => {
        if (!turn) return;
        if (blackjackState === "in-game") {
            turn.textContent = settingsManager.t('yourTurn');
        } else if (blackjackState === "dealer-turn") {
            turn.textContent = settingsManager.t('dealerTurn');
        } else if (blackjackState === "done") {
            turn.textContent = settingsManager.t('gameOver');
        } else {
            turn.textContent = "";
        }
    });

    function endRound(message) {
        win_or_lose = message;
        blackjackState = "done";
        button.setAttribute('data-label', settingsManager.t('deal'));
        button.disabled = false;
        buttonStay.disabled = true;
        updateDisplay(true, true);

        //save scores for loggin-in user
        if (currentUser) {
            userManager.addScore(message, current_score, dealer_score);
            refreshUserMenu();
        }
        //announce action
        announceAction(message);
    }

    function startCountDown() {
        resetGame(true);
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
                if (settingsManager.screenReaderEnabled) {
                    announceAction(settingsManager.t('letsPlay'));
                }
                countdown.textContent = settingsManager.t('deal');
                setTimeout(() => {
                    countdown.style.opacity = '0';
                    countdown.style.visibility = 'hidden';
                    countdown.textContent = "";
                    countdown.style.opacity = '0.6';

                    //unhide game information
                    if (gameInformation) gameInformation.style.visibility = 'visible';

                    //show and center deal button after countdown finishes
                    button.style.display = 'inline-block';
                    buttonStay.style.display = 'inline-block';
                    button.classList.remove('centered');
                    button.disabled = false;
                    buttonStay.disabled = false;
                    //start the game and undisable the buttons
                    startGame();
                }, 300);
            }
        }, 1000);
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
    playerStay = false;
    dealerStay = false;
    toggleMusicButton.disabled = true;
    toggleSoundEffectButton.disabled = true;
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
        button.setAttribute('data-label', settingsManager.t('deal'));
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

//pulls new cards
function drawCard() {
    if (blackjackState !== "in-game") {
        return;
    }
    let newCard = draw(cards);
    if (!newCard) {
        return;
    }
    your_cards.push(newCard);

    current_score = calculateScore(your_cards);

    //If Sreen Reader Enabled: announce action
    announceAction(`You drew ${newCard.rank} of ${newCard.suit}. Your score is now ${current_score}.`);

    if (current_score > 21) {
        //end the round and reveal the dealer's cards
        endRound(settingsManager.t('over21'));
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
    dealer_score = calculateScore(dealer_cards);
    //if the dealer's score is less than 17, it'll automatically draw another card

     if(dealer_score < 17) {
            let card = draw(cards);
            dealer_cards.push(card);

            //update the display for the dealer cards
            updateDisplay(true,true);
            //animate and then continue dealer turn
            //waits before the player gets their turn again to reduce abruptness
            setTimeout(() => {
                            //If Screen Reader Enabled: announce card
            announceAction(`Dealer drew ${card.rank} of ${card.suit}. Dealer's score is now ${calculateScore(dealer_cards)}.`);
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
                calculateGameResult(current_score, dealer_score, settingsManager, endRound);
            }, 650);
    } else {
        calculateGameResult(current_score, dealer_score, settingsManager, endRound);
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

    //update card labels dynamically
    document.querySelectorAll('.card-label')[0].innerHTML = `<strong>${settingsManager.t('yourCards')}</strong>`;
    document.querySelectorAll('.card-label')[1].innerHTML = `<strong>${settingsManager.t('dealerCards')}</strong>`;

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
        if (settingsManager.screenReaderEnabled) {
            cardElement.setAttribute('role', 'listitem');
            cardElement.setAttribute('aria-label', `${card.rank} of ${card.suit}`);
        } else {
            cardElement.removeAttribute('aria-label');
        }
    });
    current_score = calculateScore(your_cards);
    currentscore.dataset.value = current_score;
    currentscore.textContent = `${settingsManager.t('currentScore')}: ${current_score}`;
    if (settingsManager.screenReaderEnabled) {
        currentscore.setAttribute('aria-label', `Your current score is ${current_score}`);
        currentscore.setAttribute('aria-live', 'polite');
    } else {
        currentscore.removeAttribute('aria-label');
    }
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
        dealerscore.dataset.value = dealer_score;
        dealerscore.textContent = `${settingsManager.t('dealerScore')}: ${dealer_score}`;

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
                cardElement.classList.add('flipped', 'dealer-card');
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
        dealerscore.dataset.value =  visibleScore;
        dealerscore.textContent = `${settingsManager.t('dealerScore')}: ??? + ${visibleScore}`;
        if (settingsManager.screenReaderEnabled) {
            if (showDealer && blackjackState === "done") {
                dealerscore.setAttribute('aria-label', `Dealer's current score is ${dealer_score}`);
                dealerscore.setAttribute('aria-live', 'polite');
            } else {
                dealerscore.setAttribute('aria-label', `Dealer's visible score is ${visibleScore}`);
            }
        } else {
            dealerscore.removeAttribute('aria-label');
        }
    }
    winorlose.textContent = win_or_lose ? `${win_or_lose}` : '';
    if (settingsManager.screenReaderEnabled) {
        winorlose.setAttribute('role', 'status');
        winorlose.setAttribute('aria-live', 'assertive');
    } else {
        winorlose.removeAttribute('role');
        winorlose.removeAttribute('aria-live');
    }

    if (turn) {
        if (blackjackState === "in-game") {
            turn.textContent = settingsManager.t('yourTurn');
            button.disabled = false;
            buttonStay.disabled = false;
            buttonStay.style.visibility = 'visible';
        } else if (blackjackState === "dealer-turn") {
            turn.textContent = settingsManager.t('dealerTurn');
            button.disabled = true;
            buttonStay.disabled = true;
        } else if (blackjackState === "done") {
            turn.textContent = settingsManager.t('gameOver');
            button.disabled = false;
            buttonStay.disabled = true;
        } else {
            turn.textContent = "";
        }
    }
    if (settingsManager.screenReaderEnabled) {
        let spoken = [currentscore.textContent];
        if (showDealer && blackjackState === "done") {
            spoken.push(dealerscore.textContent);
        } else if (dealerscore.dataset.value) {
            spoken.push(`Dealer's visible score: ${dealerscore.dataset.value}`);
        }
        if (winorlose.textContent) {
            spoken.push(winorlose.textContent);
        }
        if (turn.textContent) {
            spoken.push(turn.textContent);
        }
        speak(spoken.join(". "));
    }
}
//function for the deal button click
function onButtonClick() {
    //if the sound effects are enabled, fun wheel spin sound for buttons
    playButtonSound();
    //fun spin animation for when buttons are clicked
    button.classList.add('spin');
    button.addEventListener('animationend', () => {
        button.classList.remove('spin');
    }, { once: true });

    if(blackjackState === "start") {
        startCountDown();
        blackjackState = "countdown";
    } else if (blackjackState === "in-game") {
        drawCard();
    } else if (blackjackState === "done") {
        startCountDown();
        button.setAttribute('data-label', settingsManager.t('deal'));
        blackjackState = "start";
    }
}

//function for the player to have a stay option
function onStayClick() {
    //if sound effects enabled, fun wheel spin sound for buttons
    playButtonSound();
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

//function for starting the game
function startGame() {
    startGameAudio();
    button.classList.remove('centered');
    buttonStay.style.visibility = 'visible';
    const resultBox = document.getElementById('result-box');
    if(resultBox) resultBox.style.display = 'block';
    const scoreBox = document.getElementById('score-box');
    if(scoreBox) scoreBox.style.display = 'block';
    const cardLabels = document.querySelectorAll('.card-label');
    cardLabels.forEach(label => {
        label.style.display = 'block';
    });
    blackjackState = "in-game";
    button.setAttribute('data-label', settingsManager.t('deal'));
    button.disabled = false;
    buttonStay.disabled = false;
    toggleMusicButton.disabled = false;
    toggleSoundEffectButton.disabled = false;
    //the dealer gets their cards
    //you get your cards
    dealer_cards.push(draw(cards), draw(cards));
    your_cards.push(draw(cards), draw(cards));

    //update scores
    current_score = calculateScore(your_cards);

    updateDisplay(false, true);

}


//listener for button
button.addEventListener('click', onButtonClick);
buttonStay.addEventListener('click', onStayClick);

//read any button/input label when hovered
document.querySelectorAll('button, input, li, p, h4, h3, h2, ul, [role="listitem"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (settingsManager.screenReaderEnabled) {
            let label = el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent;
            speak(label.trim());
        }
    });
});

//Initialize First Round
resetGame();

applyTooltips(settingsManager);
});