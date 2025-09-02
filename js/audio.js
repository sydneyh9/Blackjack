//audio.js

const buttonSound = document.getElementById('button-sound');
const backgroundMusic = document.getElementById('background-music');
const backgroundMusicSecond = document.getElementById('background-music-second');
const casino = document.getElementById('casino');

let musicEnabled = true;
let soundEffectsEnabled = true;

export function playButtonSound() {
    if (soundEffectsEnabled) {
        buttonSound.currentTime = 0;
        buttonSound.play().catch(() => {});
    }
}

export function toggleMusic(enabled) {
    musicEnabled = enabled;
    if (musicEnabled) {
        if(backgroundMusic.paused) backgroundMusic.play().catch(() => {});
        if (casino.paused) casino.play().catch(() => {});
    } else {
        backgroundMusic.pause();
        backgroundMusicSecond.pause();
        casino.pause();
    }
}

export function toggleSoundEffects(enabled) {
    soundEffectsEnabled = enabled;
}

export function setMusicVolume(value) {
    backgroundMusic.volume = value;
    backgroundMusicSecond.volume = value;
    casino.volume = value;
}

export function setSoundEffectsVolume(value) {
    buttonSound.volume = value;
}