//user.js
const STORAGE_KEY = "blackjack_users";

export class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        this.currentUser = null;
    }
    //login logic
    login(username) {
        //if there is no username with that username
        if (!username) return false;
        if (!this.users[username]) {
            //make new user profile
            this.users[username] = {scores:[]};
        }
        this.currentUser = username;
        this._save();
        return true;
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
    _save() {
        localStorage.getItem(STORAGE_KEY, JSON.stringify(this.users));
    }
}