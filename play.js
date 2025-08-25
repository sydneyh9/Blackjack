import { resetGame} from './gameState.js';
import {onButtonClick, onStayClick, onSettingsClick} from './controls.js';

document.addEventListener('DOMContentLoaded', () => {
    const countdown = document.getElementById('countdown');
    //basic game elements declarations
    const gameInformation = document.getElementById('game_information');
    //establish button for dealing the cards
    const button = document.getElementById('deal');
    const buttonStay = document.getElementById('stay');
    const buttonSound = document.getElementById('button-sound');
    const backgroundMusic = document.getElementById('background-music');
    const backgroundMusicSecond = document.getElementById('background-music-second');
    const casino = document.getElementById('casino');
    const toggleMusicButton = document.getElementById('toggle-music');
    const toggleSoundEffectButton = document.getElementById('toggle-sound-effect');
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');
    const musicVolumeSlider = document.getElementById('music-volume');
    const EffectsVolumeSlider = document.getElementById('effects-volume');
    const instructionsOverlay = document.getElementById('instructions-overlay');
    const closeInstructionsButton = document.getElementById('close-instructions');

    button.classList.add('centered');
    
    //show the instructions when the page loads
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

    //handle music volume
    musicVolumeSlider.addEventListener('input', () => {
        const volume = parseFloat(musicVolumeSlider.value);
        backgroundMusic.volume = volume;
        backgroundMusicSecond.volume = volume;
    });

    //handle sound effects volume
    EffectsVolumeSlider.addEventListener('input', () => {
        const volume = parseFloat(EffectsVolumeSlider.value);
        buttonSound.volume = volume;
        casino.volume = volume;
    });

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
        toggleSoundEffectButton.textContent = soundEffectEnabled ? "Sound Effects On" : "Sound Effects Off";

        if (soundEffectEnabled) {
            casino.play().catch(err => {
                console.log("Failed to play casino ambience:", err);
            });
        } else {
            casino.pause();
        }
    });


    

//listener for button
button.addEventListener('click', onButtonClick);
buttonStay.addEventListener('click', onStayClick);
settingsButton.addEventListener('click', onSettingsClick);

//Initialize First Round
resetGame();

});