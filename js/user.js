//user.js
const STORAGE_KEY = "blackjack_users";
const CURRENT_USER_KEY = "blackjack_current_user";

export class UserManager {
    constructor(translator) {
        this.t = translator;
        //get the saved users from localStorage
        const savedUsers = localStorage.getItem(STORAGE_KEY);
        this.users = savedUsers ? JSON.parse(savedUsers) : {};
        this.currentUser = localStorage.getItem(CURRENT_USER_KEY) || null;
    }
    //password security
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    async signup(username, password) {
        //if the username and password don't exist already
        if (!username || !password) return { success: false, message: this.t('signupRequired')};
        //if it does exist
        if (this.users[username]) {
            return { success: false, message: this.t('signupExists')};
        }

        const hashedPassword = await this.hashPassword(password);

        //create new user profile
        this.users[username] = {
            password: hashedPassword,
            scores: [],
            streak: 0 };
            //make sure the users information still exists
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
        return { success: true, message: this.t('signupSuccess')};
    }
    //login logic
    async login(username, password) {
        //if there is no username or password with that username
        if (!username || !password) return { success: false, message: this.t('loginRequired')};
        const user = this.users[username];
        //check if username and password are correct
        const hashedPassword = await this.hashPassword(password);
        if (!user || user.password !== hashedPassword) {
            return { success: false, message: this.t('loginInvalid')};
        }

        //else, log in successfully
        this.currentUser = username;
        localStorage.setItem(CURRENT_USER_KEY, username);
        return { success: true, message: `${this.t('welcome')}, ${username}!`};
        }
        logout() {
            this.currentUser = null;
            localStorage.removeItem(CURRENT_USER_KEY);
        }
        addScore(result, playerScore, dealerScore) {
            if (!this.currentUser) return;
            this.users[this.currentUser].scores.push({
                result,
                playerScore,
                dealerScore,
                timestamp: new Date().toISOString()
            });
            //make sure the scores are saved
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
            localStorage.setItem(CURRENT_USER_KEY, this.currentUser);
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
    }