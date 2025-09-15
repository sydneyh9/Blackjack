//user.js
const STORAGE_KEY = "blackjack_users";

export class UserManager {
    constructor(translator) {
        this.users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        this.currentUser = null;
        this.t = translator;
    }
    signup(username, password) {
        if (!username || !password) return { success: false, message: this.t('signupRequired')};
        if (this.users[username]) {
            return { success: false, message: this.t('signupExists')};
        }

        //create new user profile
        this.users[username] = {
            password: password,
            scores: []
        };
        this._save();
        return { success: true, message: this.t('signupSucess')};
    }
    //login logic
    login(username, password) {
        //if there is no username or password with that username
        if (!username || !password) return { success: false, message: this.t('loginRequired')};
        const user = this.users[username];
        //check if username and password are correct
        if (!user || user.password !== password) {
            return { success: false, message: this.t('loginInvalid')};
        }
        //else, log in successfully
        this.currentUser = username;
        this._save();
        return { success: true, message: `${this.t('welcome')}, ${username}!`};
        }
        logout() {
            this.currentUser = null;
        }
        addScore(result, playerScore, dealerScore) {
            if (!this.currentUser) return;
            this.users[this.currentUser].scores.push({
                result,
                playerScore,
                dealerScore,
                timestamp: new Date().toISOString()
            });
            this._save();
        }

        getUserScores(username = this.currentUser) {
            return this.users[username]?.scores || [];
        }

        getWinStreak(username = this.currentUser) {
            const scores = this.getUserScores(username);
            let streak = 0;
            for (let i = scores.length - 1; i >= 0; i--) {
                if (scores[i].result.toLowerCase().includes("win")) {
                    streak++;
                } else {
                    break;
                }
            }
            return streak;
        }
        _save() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
        }
    }