//settings.js

import { toggleMusic, toggleSoundEffects, setMusicVolume, setSoundEffectsVolume} from './audio.js';
const settingsButton = document.getElementById('settings-button');
const settingsOverlay = document.getElementById('settings-overlay');
const instructionsOverlay = document.getElementById('instructions-overlay');
const closeInstructionsButton = document.getElementById('close-instructions');
const helpButton = document.getElementById('help-button');
const toggleMusicBtn = document.getElementById('toggle-music');
const toggleSoundBtn = document.getElementById('toggle-sound-effect');
const musicVolumeSlider = document.getElementById('music-volume');
const soundVolumeSlider = document.getElementById('effects-volume');

toggleMusicBtn.setAttribute('aria-pressed', 'true');
toggleMusicBtn.textContent = "Music On";

toggleSoundBtn.setAttribute('aria-pressed','true');
toggleSoundBtn.textContent = "Sound Effects On";

toggleMusicBtn.addEventListener('click', () => {
    const isEnabled = toggleMusicBtn.getAttribute('aria-pressed') === 'true';
    toggleMusic(!isEnabled);
    toggleMusicBtn.setAttribute('aria-pressed', (!isEnabled).toString());
    toggleMusicBtn.textContent = !isEnabled ? "Music On" : "Music Off";
});

toggleSoundBtn.addEventListener('click', () => {
    const isEnabled = toggleSoundBtn.getAttribute('aria-pressed') === 'true';
    toggleSoundEffects(!isEnabled);
    toggleSoundBtn.setAttribute('aria-pressed', (!isEnabled).toString());
    toggleSoundBtn.textContent = !isEnabled ? "Sound Effects On" : "Sound Effects Off";
});

musicVolumeSlider.addEventListener('input', (e) => 
    setMusicVolume(parseFloat(e.target.value)));

soundVolumeSlider.addEventListener('input', (e) => 
    setSoundEffectsVolume(parseFloat(e.target.value)));

settingsButton.addEventListener('click', () => { settingsOverlay.classList.toggle('show'); });

closeInstructionsButton.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
});

helpButton.addEventListener('click', () => {
    instructionsOverlay.style.display = instructionsOverlay.style.display === "flex" ? "none": "flex";
});

settingsOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'settings-overlay') {
        settingsOverlay.classList.remove('show');
    }
});

instructionsOverlay.addEventListener('click', (e) => {
    if (e.target === instructionsOverlay) {
        instructionsOverlay.style.display = 'none';
    }
});