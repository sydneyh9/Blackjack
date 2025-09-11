//audio.js

let musicEnabled = true;
let soundEffectEnabled = true;

const buttonSound = document.getElementById('button-sound');
const backgroundMusic = document.getElementById('background-music');
const backgroundMusicSecond = document.getElementById('background-music-second');
const casino = document.getElementById('casino');
const toggleMusicButton = document.getElementById('toggle-music');
const toggleSoundEffectButton = document.getElementById('toggle-sound-effect');
const musicVolumeSlider = document.getElementById('music-volume');
const effectsVolumeSlider = document.getElementById('effects-volume');

//volume control sliders
 //handle music volume
 musicVolumeSlider.addEventListener('input', () => {
    if (!musicEnabled) return;
    const volume = parseFloat(musicVolumeSlider.value);
    backgroundMusic.volume = volume;
    backgroundMusicSecond.volume = volume;
});
   //handle sound effects volume
   effectsVolumeSlider.addEventListener('input', () => {
    if (!soundEffectEnabled) return;
    const volume = parseFloat(effectsVolumeSlider.value);
    buttonSound.volume = volume;
    casino.volume = volume;
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

//Public API functions for play.js
export function playButtonSound() {
    if (soundEffectEnabled) {
        buttonSound.play().catch(err => console.log("Button sound failed:", err));
    }
}

export function startGameAudio() {
    if (musicEnabled) {
        backgroundMusic.play().catch(err => console.log("Background music failed:", err));
    }
    if (soundEffectEnabled) {
        casino.play().catch(err => console.log("Casino ambience failed:", err));
    }
}

export function stopGameAudio() {
    backgroundMusic.pause();
    backgroundMusicSecond.pause();
    casino.pause();
}