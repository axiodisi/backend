const Database = require("@replit/database");
const bcrypt = require('bcryptjs');

const db = new Database();

const userUtils = {
    async createUser(username, password) {
        const hashedPassword = await bcrypt.hash(password, 8);
        await db.set(`user_${username}`, { username, password: hashedPassword });
        return { username };
    },

    async getUser(username) {
        return await db.get(`user_${username}`);
    },

    async validatePassword(user, password) {
        return await bcrypt.compare(password, user.password);
    }
};

module.exports = userUtils;
