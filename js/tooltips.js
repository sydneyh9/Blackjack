//tooltips.js
export function applyTooltips(settingsManager) {
    const tooltips = {
        deal: settingsManager.t('tooltipDeal') || "Deal a new card",
        stay: settingsManager.t('tooltipStay') || "Stay",
        settings: settingsManager.t('tooltipSettings') || "Change game settings",
        help: settingsManager.t('tooltipHelp') || "View Instructions",
        login: settingsManager.t('tooltipLogin') || "Log in with your username",
        username: settingsManager.t('tooltipUsername') || "Enter your username",
        toggleMusic: settingsManager.t('tooltipMusic') || "Toggle background music",
        toggleSound: settingsManager.t('tooltipSound') || "Toggle sound effects",
        musicVolume: settingsManager.t('tooltipMusicVolume') || "Adjust music volume",
        effectsVolume: settingsManager.t('tooltipEffectsVolume')|| "Adjust sound effect volume",
        closeMenu: settingsManager.t('tooltipCloseMenu') || "Click to close the menu"
    };
    document.getElementById('deal')?.setAttribute('title', tooltips.deal);
    document.getElementById('stay')?.setAttribute('title', tooltips.stay);
    document.getElementById('settings-button')?.setAttribute('title', tooltips.settings);
    document.getElementById('help-button')?.setAttribute('title', tooltips.help);
    document.getElementById('login-button')?.setAttribute('title', tooltips.login);
    document.getElementById('username-input')?.setAttribute('title', tooltips.username);
    document.getElementById('toggle-music')?.setAttribute('title', tooltips.toggleMusic);
    document.getElementById('toggle-sound-effect')?.setAttribute('title', tooltips.toggleSound);
    document.getElementById('music-volume')?.setAttribute('title', tooltips.musicVolume);
    document.getElementById('effects-volume')?.setAttribute('title', tooltips.effectsVolume);
    document.getElementById('close-user-menu')?.setAttribute('title', tooltips.closeMenu);
}