//settings.js
import {applyTooltips} from './tooltips.js';
export class SettingsManager {
    constructor() {
        this.settingsButton = document.getElementById('settings-button');
        this.settingsMenu = document.getElementById('settings-menu');
        this.settingsOverlay = document.getElementById('settings-overlay');
        this.languageButton = null;
        this.currentLanguage = 'en';
        this.screenReaderEnabled = false;
        this.translations = {
            en: {
                welcome: "Welcome",
                deal: "Deal",
                stay: "Stay",
                yourTurn: "Your turn.",
                dealerTurn: "Dealer's turn.",
                gameOver: "Game over.",
                currentScore: "Current Score",
                dealerScore: "Dealer's Score",
                over21: "You went over. You Lose!",
                dealerOver21: "Dealer went over. You win!",
                tie: "Looks like you tied. It's a draw.",
                perfect21: "A perfect 21. You win!",
                dealerWins: "Dealer wins.",
                playerWins: "You win!",
                bothOverPlayerWins: "You both went over but you have the better hand! You win!",
                bothOverDealerWins: "You both went over but the dealer has the better hand! Dealer wins.",
                yourCards: "Your Cards",
                dealerCards: "Dealer's Cards",
                settings: "Settings",
                userMenu: "User",
                instructionsTitle: "Welcome to Blackjack!",
                audioControls: "Audio Controls",
                musicOn: "Music On",
                musicOff: "Music Off",
                soundEffectsOn: "Sound Effects On",
                soundEffectsOff: "Sound Effects Off",
                musicVolume: "Music Volume",
                soundVolume: "Sound Effects Volume",
                instructionsObjective: "Objective:",
                instructionsObjectiveText: "Beat the dealer by getting a hand as close to 21 as possible, without going over",
                instructionsRules: "Rules:",
                instructionsRule1: "If both dealer and player go over 21, the better hand wins.",
                instructionsRule2: "You may only draw one card per turn.",
                instructionsRule3: "Only one deck of 52 is used.",
                instructionsRule4: "The dealer's first card is hidden.",
                instructionsRule5: "The Ace may be used as either 1 or 11 as per the dealer or player's needs.",
                ruleDeal: "Click Deal to start a new game.",
                ruleStay: "Click Stay to end your turn and let the dealer play.",
                ruleKeepScore: "Keep a close eye on your score!",
                letsPlay: "Let's Play!",
                results: "Results:",
                language: "Language",
                tooltipDeal: "Click to deal a new card",
                tooltipStay: "Click to stay",
                tooltipSettings: "Open game settings",
                tooltipHelp: "Open instructions",
                tooltipLogin: "Log in with your username",
                tooltipUsername: "Enter your username",
                tooltipMusic: "Toggle background music",
                tooltipSound: "Toggle sound effects",
                tooltipMusicVolume: "Adjust music volume",
                tooltipEffectsVolume: "Adjust sound effects volume"
            },
            es: {
                welcome: "Bienvenido",
                deal: "Repartir",
                stay: "Plantarse",
                yourTurn: "Tu turno.",
                dealerTurn: "Turno del dealer.",
                gameOver: "Juego terminado.",
                currentScore: "Puntaje actual",
                dealerScore: "Puntaje del dealer",
                over21: "¡Te pasaste! ¡Pierdes!",
                dealerOver21: "¡El dealer se pasó! ¡Ganas!",
                tie: "Parece que empataron. Es un empate.",
                perfect21: "¡21 perfecto! ¡Ganas!",
                dealerWins: "El dealer gana.",
                playerWins: "¡Ganas!",
                bothOverPlayerWins: "¡Ambos se pasaron, pero tu mano es mejor! ¡Ganas!",
                bothOverDealerWins: "¡Ambos se pasaron, per la mano del dealer es mejor! Dealer gana.",
                yourCards: "Tus cartas",
                dealerCards: "Cartas del dealer",
                settings: "Configuración",
                userMenu: "Usuario",
                instructionsTitle: "¡Bienvenido a Blackjack!",
                instructionsObjective: "Objectivo",
                audioControls: "Controles de Audio",
                musicOn: "Música Activada",
                musicOff: "Música Desactivada",
                soundEffectsOff: "Efectos de Sonido Desactivados",
                soundEffectsOn: "Efectos de Sonido Activados",
                musicVolume: "Volumen de Música",
                soundVolume: "Volumen de Efectos",
                instructionsObjectiveText: "Gana al dealer obteniendo una mano lo más cerca posible de 21 sin pasarte.",
                instructionsRules: "Reglas:",
                instructionsRule1: "Si el dealer y el jugador se pasan de 21, gana la mejor mano.",
                instructionsRule2: "Solo puedes sacar una carta por turno.",
                instructionsRule3: "Se utiliza solo un mazo de 52 cartas.",
                instructionsRule4: "La primera carta del dealer está oculta.",
                instructionsRule5: "El As puede valer 1 u 11 según lo necesite el dealer o el jugador.",
                ruleDeal: "Haz clic en Repartir para comenzar un juego nuevo.",
                ruleStay: "Haz clic en Plantarse para terminar tu turno y dejar que el dealer juegue.",
                ruleKeepScore: "!Mantén un ojo en tu puntuación!",
                letsPlay: "!Juguemos!",
                results: "Resultados:",
                language: "Idioma",
                tooltipDeal: "Haz clic para repartir una carta nueva",
                tooltipStay: "Haz clic para plantarte",
                tooltipSettings: "Abrir configuración del juego",
                tooltipHelp: "Abrir instrucciones",
                tooltipLogin: "Inicia sesión con tu nombre de usuario",
                tooltipUsername: "Introduce tu nombre de usuario",
                tooltipMusic: "Activar o desactivar la música",
                tooltipSound: "Activar o desactivar los efectos de sonido",
                tooltipMusicVolume: "Ajustar volumen de la música",
                tooltipEffectsVolume: "Ajustar volumen de los efectos de sonido"
            },
            fr: {
                welcome: "Bienvenue",
                deal: "Distribuer",
                stay: "Rester",
                yourTurn: "Votre tour.",
                dealerTurn: "Tour du croupier.",
                gameOver: "Jeu terminé.",
                currentScore: "Score actuel",
                dealerScore: "Score du croupier",
                over21: "Vous avez dépassé 21. Vous perdez !",
                dealerOver21: "Le croupier a dépassé 21. Vous gagnez !",
                tie: "Égalité. Match nul.",
                perfect21: "Un 21 parfait ! Vous gagnez !",
                dealerWins: "Le croupier gagne.",
                playerWins: "Vous gagnez !",
                bothOverPlayerWins: "Vous avez tous les deux dépassé 21 mais votre main est meilleure ! Vous gagnez !",
                bothOverDealerWins: "Vous avez tous les deux dépassé 21 mais le croupier a la meilleure main ! Le croupier gagne.",
                yourCards: "Vos cartes",
                dealerCards: "Cartes du croupier",
                settings: "Paramètres",
                userMenu: "Utilisateur",
                instructionsTitle: "Bienvenue au Blackjack !",
                audioControls: "Contrôles Audio",
                musicOn: "Musique Activée",
                musicOff: "Musique Désactivée",
                soundEffectsOn: "Effets Sonores Activés",
                soundEffectsOff: "Effets Sonores Désactivés",
                musicVolume: "Volume de la Musique",
                soundVolume: "Volume des Effets",
                instructionsObjective: "Objectif :",
                instructionsObjectiveText: "Battez le croupier en obtenant une main la plus proche de 21 sans dépasser.",
                instructionsRules: "Règles :",
                instructionsRule1: "Si le croupier et le joueur dépassent 21, la meilleure main gagne.",
                instructionsRule2: "Vous ne pouvez tirer qu'une seule carte par tour.",
                instructionsRule3: "Un seul jeu de 52 cartes est utilisé.",
                instructionsRule4: "La première carte du croupier est cachée.",
                instructionsRule5: "L'As peut être utilisé comme 1 ou 11 selon le besoin du croupier ou du joueur.",
                ruleDeal: "Cliquez sur Distribuer pour commencer une nouvelle partie.",
                ruleStay: "Cliquez sur Rester pour terminer votre tour et laisser le croupier jouer.",
                ruleKeepScore: "Surveillez attentivement votre score !",
                letsPlay: "Jouons !",
                results: "Résultats:",
                language: "Langue",
                tooltipDeal: "Cliquez pour distribuer une nouvelle carte",
                tooltipStay: "Cliquez pour rester",
                tooltipSettings: "Ouvrir les paramètres du jeu",
                tooltipHelp: "Ouvrir les instructions",
                tooltipLogin: "Connectez-vous avec votre nom d'utilisateur",
                tooltipUsername: "Entrez votre nom d'utilisateur",
                tooltipMusic: "Activer ou désactiver la musique",
                tooltipSound: "Activer ou désactiver les effets sonores",
                tooltipMusicVolume: "Régler le volume de la musique",
                tooltipEffectsVolume: "Régler le volume des effets sonores"
            }
        };
        this.init();
    }

    init() {
        if (!this.settingsButton || !this.settingsMenu || !this.settingsOverlay) return;

        //toggle menu visibility on button click
        this.settingsButton.addEventListener('click', () => {
            this.settingsMenu.classList.toggle('show');
            this.settingsOverlay.classList.toggle('show');
            this.animateButton();
        });

        //hide menu if user clicks outside
        document.addEventListener('click', (event) => {
            if (!this.settingsButton.contains(event.target) && !this.settingsMenu.contains(event.target)) {
                this.settingsMenu.classList.remove('show');
                this.settingsOverlay.classList.remove('show');
            }
        });
        //hide overlay if clicked directly
        this.settingsOverlay.addEventListener('click', (e) => {
            if (e.target === this.settingsOverlay) {
                this.settingsOverlay.classList.remove('show');
            }
        });

        //Language toggle button
        this.createLanguageButton();

        //update all the text to the current language
        this.updateText();

        //Screen reader toggle
        const screenReaderBtn = document.getElementById('toggle-screen-reader');
        if (screenReaderBtn) {
            screenReaderBtn.addEventListener('click', () => {
                this.screenReaderEnabled = !this.screenReaderEnabled;
                screenReaderBtn.setAttribute('aria-pressed', this.screenReaderEnabled);
                screenReaderBtn.textContent = this.screenReaderEnabled ? 'Screen Reader On' : 'Screen Reader Off';

                //trigger refresh for labels
                if (typeof this.onScreenReaderToggle === 'function') this.onScreenReaderToggle(this.screenReaderEnabled);
            });
        }
    }

    animateButton(){
        this.settingsButton.classList.add('spin');
        this.settingsButton.addEventListener('animationend', () => {
            this.settingsButton.classList.remove('spin');
        }, {once: true});
    }

    createLanguageButton() {
        //heading
        const langHeading = document.createElement('h4');
        langHeading.textContent = 'Language';
        langHeading.style.marginTop = '15px';
        this.settingsMenu.appendChild(langHeading);

        //container for buttons
        const langContainer = document.createElement('div');
        langContainer.id = 'language-options';
        langContainer.style.display = 'flex';
        langContainer.style.gap = '10px';
        langContainer.style.marginTop = '5px';

        //languages available
        const availableLangs = { en: "English", es: "Español", fr: "Français"};

        Object.entries(availableLangs).forEach(([code, label]) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.dataset.lang = code;
            btn.classList.add('lang-btn');
            if (code === this.currentLanguage) btn.classList.add('active');

            btn.addEventListener('click', () => {
                this.currentLanguage = code;
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateText();
            });
            langContainer.appendChild(btn);
        });
        this.settingsMenu.appendChild(langContainer);
    }

    cycleLanguage() {
        if (this.currentLanguage === 'en') this.currentLanguage = 'es';
        else if (this.currentLanguage === 'es') this.currentLanguage = 'fr';
        else this.currentLanguage = 'en';

        this.updateText();
    }

    t(key) {
        //translation helper
        return this.translations[this.currentLanguage][key] || key;
    }
    updateText() {
        //update settings button
        this.settingsButton.setAttribute('data-label', this.t('settings'));
        this.settingsButton.setAttribute('aria-label', this.t('settings'));

        //deal and stay button updates
        const dealBtn = document.getElementById('deal');
        if (dealBtn) {
            dealBtn.setAttribute('aria-label', this.t('deal'));
            dealBtn.setAttribute('data-label', this.t('deal'));
            dealBtn.querySelector('.inner').textContent = this.t('deal');
        }

        const stayBtn = document.getElementById('stay');
        if (stayBtn) {
            stayBtn.setAttribute('aria-label', this.t('stay'));
            stayBtn.setAttribute('data-label', this.t('stay'));
            stayBtn.querySelector('.inner').textContent = this.t('stay');
        }

        //update audio controls
        const audioLabel = document.getElementById('audio-controls-label');
        if (audioLabel) audioLabel.textContent = this.t('audioControls');

        const toggleMusic = document.getElementById('toggle-music');
        if (toggleMusic) {
            toggleMusic.textContent = toggleMusic.classList.contains('active') ? this.t('musicOn') : this.t('musicOff');
        }

        const toggleSound = document.getElementById('toggle-sound-effect');
        if (toggleSound) {
            toggleSound.textContent = toggleSound.classList.contains('active') ? this.t('soundEffectsOn') : this.t('soundEffectsOff');
        }

        const musicVolumeLabel = document.querySelector('label[for="music-volume"]');
        if (musicVolumeLabel) musicVolumeLabel.textContent = this.t('musicVolume');

        const soundVolumeLabel = document.querySelector('label[for="effects-volume"]');
        if (soundVolumeLabel) soundVolumeLabel.textContent = this.t('soundVolume');

        //instructions overlay
        const instrOverlay = document.querySelector('#instructions-overlay');
        if (instrOverlay) {
            const title = instrOverlay.querySelector('h2')
            title && (title.textContent = this.t('instructionsTitle'));
            const objectiveHeading = instrOverlay.querySelector('h3');
            objectiveHeading && (objectiveHeading.textContent = this.t('instructionsObjective'));
            const objectiveText = instrOverlay.querySelector('.instructions-box > p');
            if (objectiveText) {
                objectiveText.textContent = this.t('instructionsObjectiveText');
            }
            const ruleParagraphs = instrOverlay.querySelectorAll('.instructions-box > p');
            if (ruleParagraphs.length >= 5) {
                ruleParagraphs[1].textContent = this.t('instructionsRule1');
                ruleParagraphs[2].textContent = this.t('instructionsRule2');
                ruleParagraphs[3].textContent = this.t('instructionsRule3');
                ruleParagraphs[4].textContent = this.t('instructionsRule4');
                ruleParagraphs[5].textContent = this.t('instructionsRule5');
            }

            const rulesHeading = instrOverlay.querySelector('h4');
            rulesHeading && (rulesHeading.textContent = this.t('instructionsRules')); 

            const rules = instrOverlay.querySelectorAll('ul li');
            if (rules.length >= 3) {
                rules[0].textContent = this.t('ruleDeal');
                rules[1].textContent = this.t('ruleStay');
                rules[2].textContent = this.t('ruleKeepScore');
            }

            const closeBtn = instrOverlay.querySelector('#close-instructions');
            if (closeBtn) closeBtn.textContent = this.t('letsPlay');
        }
        //Card labels
        const yourLabel = document.querySelector('.card-row .card-label strong');
        if (yourLabel) yourLabel.textContent = this.t('yourCards');
        const dealerLabel = document.querySelectorAll('.card-row .card-label strong')[1];
        if (dealerLabel) dealerLabel.textContent = this.t('dealerCards');

        //results label
        const resultsLabel = document.getElementById('results');
        if (resultsLabel) resultsLabel.textContent = this.t('results') || "Results:";

        //update language heading
        const langHeading = this.settingsMenu.querySelector('h4');
        if (langHeading) langHeading.textContent = this.t('language') || 'Language';

        //update tooltips
        if (typeof applyTooltips === 'function') {
            applyTooltips(this);
        }
        
        //update scores
        const currentScoreEl = document.getElementById('current_score');
        if (currentScoreEl) {
            const score = currentScoreEl.dataset.value || "";
            currentScoreEl.textContent = `${this.t('currentScore')}: ${score}`;
        }
        const dealerScoreEl = document.getElementById('dealer_score');
        if (dealerScoreEl) {
            const score = dealerScoreEl.dataset.value || "";
            dealerScoreEl.textContent = `${this.t('dealerScore')}: ${score}`;
        }
        //update turn text
        const turnEl = document.getElementById('turn');
        if (turnEl) {
            //update the turn text based on changing languages
            const event = new Event('languageChanged');
            turnEl.dispatchEvent(event);
        }
        const userMenuBtn = document.getElementById('user-menu-button');
        if (userMenuBtn) {
            userMenuBtn.setAttribute('aria-label', this.t('userMenu'));
            userMenuBtn.setAttribute('data-label', this.t('userMenu'));
        }

    }
}