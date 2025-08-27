//settings.js

let musicEnabled = true;
let soundEffectEnabled = true;

export function initialAudioSettings() {
    const backgroundMusic = document.getElementById('background-music');
    const backgroundMusicSecond = document.getElementById('background-music-second');
    const buttonSound = document.getElementById('button-sound');
    const casino = document.getElementById('casino');
    const toggleMusicButton = document.getElementById('toggle-music');
    const toggleSoundEffectButton = document.getElementById('toggle-sound-effect');
    const settingsButton = document.getElementById('settings-button');
    const settingsMenu = document.getElementById('settings-menu');
    const musicVolumeSlider = document.getElementById('music-volume');
    const effectsVolumeSlider = document.getElementById('effects-volume');

    //handle music volume
    musicVolumeSlider.addEventListener('input', () => {
        const volume = parseFloat(musicVolumeSlider.value);
        backgroundMusic.volume = volume;
        backgroundMusicSecond.volume = volume;
    });
    //handle sound effects volume
    effectsVolumeSlider.addEventListener('input', () => {
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


    //making sure I don't play both at once
    backgroundMusicSecond.pause();
    backgroundMusicSecond.currentTime = 0;

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
        }
    });
    //buttons for the user to turn off music and ambience if they want
    toggleMusicButton.addEventListener('click', () => {

       /* //don't allow toggling music before the game starts 
        if (blackjackState === "start") {
                console.log("Music can't be toggled until the game starts.");
                return;
            }*/
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


}