export function startCountDown({
    countdown,
    button,
    buttonStay,
    gameInformation,
    startGame
}) {
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