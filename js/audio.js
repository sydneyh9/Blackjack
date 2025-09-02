//audio.js

const buttonSound = document.getElementById('button-sound');
const backgroundMusic = document.getElementById('background-music');
const backgroundMusicSecond = document.getElementById('background-music-second');
const casino = document.getElementById('casino');

let musicEnabled = true;
let soundEffectsEnabled = true;
let currentTrack = 1;

function playNextTrack() {
    if (!musicEnabled) return;

    if (currentTrack === 1) {
        backgroundMusic.play().catch(() => {});
        backgroundMusic.onended = () => {
            currentTrack = 2;
            playNextTrack();
        };
    } else {
        backgroundMusicSecond.play().catch(() => {});
        backgroundMusicSecond.onended = () => {
            currentTrack = 1;
            playNextTrack();
        };
    }
}

//play button click sound
export function playButtonSound() {
    if (soundEffectsEnabled) {
        buttonSound.currentTime = 0;
        buttonSound.play().catch(() => {});
    }
}

//toggling music button
export function toggleMusic(enabled) {
    musicEnabled = enabled;
    if (musicEnabled) {
        if(currentTrack === 1 && backgroundMusic.paused) {
            playNextTrack();
        } else if (currentTrack === 2 && backgroundMusicSecond.paused) {
            playNextTrack();
        }
    } else {
        backgroundMusic.pause();
        backgroundMusicSecond.pause();
    }
}

//toggling sound effect button
export function toggleSoundEffects(enabled) {
    soundEffectsEnabled = enabled;
    if (soundEffectsEnabled) {
        if (casino.paused) casino.play().catch(() => {});
    } else {
        casino.pause();
    }
}

//setting music volume
export function setMusicVolume(value) {
    backgroundMusic.volume = value;
    backgroundMusicSecond.volume = value;
}

export function setSoundEffectsVolume(value) {
    buttonSound.volume = value;
    casino.volume = value;

    if (soundEffectsEnabled && casino.paused) {
        casino.play().catch(() => {});
    }
}