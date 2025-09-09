//settings.js

export class SettingsManager {
    constructor() {
        this.settingsButton = document.getElementById('settings-button');
        this.settingsMenu = document.getElementById('settings-menu');
        this.settingsOverlay = document.getElementById('settings-overlay');
        this.languageButton = null;
        this.currentLanguage = 'en';
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
                bothOverDealerWins: "You both went over but the dealer has the better hand! Dealer wins."
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
                bothOverDealerWins: "¡Ambos se pasaron, per la mano del dealer es mejor! Dealer gana."
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
                bothOverDealerWins: "Vous avez tous les deux dépassé 21 mais le croupier a la meilleure main ! Le croupier gagne."
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

        //add language toggle button
        this.createLanguageButton();
    }

    animateButton(){
        this.settingsButton.classList.add('spin');
        this.settingsButton.addEventListener('animationend', () => {
            this.settingsButton.classList.remove('spin');
        }, {once: true});
    }

    createLanguageButton() {
        this.languageButton = document.createElement('button');
        this.languageButton.id = 'language-toggle';
        this.languageButton.textContent = 'Language';
        this.languageButton.style.marginTop = '10px';
        this.settingsMenu.appendChild(this.languageButton);

        this.languageButton.addEventListener('click', () => {
            this.cycleLanguage();
        });
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
}