//buttons.js
import { soundEffectEnabled, playButtonSound } from "./settings.js";
import { startCountDown} from './utils/startCountdown.js';
//Spin animation
function animateButton(button) {
    button.classList.add("spin");
    button.addEventListener("animationend", () => button.classList.remove("spin"), { once: true});
}

//Deal button
export function handleDealClick({blackjackState, startCountDown, drawCard, resetGame}) {
    return function (e) {
        if (soundEffectEnabled) {
            playButtonSound();
        }
        animateButton(e.currentTarget);
        if (blackjackState.value === "start") {
            startCountDown();
        } else if (blackjackState.value === "in-game") {
            drawCard();
        } else if (blackjackState.value === "done") {
            resetGame(true);
        }
    };
}

//Stay button
export function handleStayClick( {blackjackState, dealerTurn, setPlayerStay}) {
    return function (e) {
        if (soundEffectEnabled) {
            playButtonSound();
        }
        animateButton(e.currentTarget);

        if(blackjackState.value === "in-game") {
            setPlayerStay(true);
            dealerTurn();
        }
    };
}