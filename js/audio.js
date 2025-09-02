//audio.js

const buttonSound = document.getElementById('button-sound');
const backgroundMusic = document.getElementById('background-music');
const backgroundMusicSecond = document.getElementById('background-music-second');
const casino = document.getElementById('casino');

export function playButtonSound() {
    buttonSound.play().catch(() => {});
}

export function toggleMusic(enabled) {
    if (enabled) {
        backgroundMusic.play().catch(() => {});
        casino.play().catch(() => {});
    } else {
        backgroundMusic.pause();
        backgroundMusicSecond.pause();
        casino.pause();
    }
}