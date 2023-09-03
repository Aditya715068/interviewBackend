const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Session = db.Session;

module.exports = {
    login,
    logout
};

async function login(body, userIP) {
    const token = body.token;
    const session = await Session.findOne({token: token});
    if (!session) {
        const user = await User.findOne({ username: body.firstName });
        let json = {
            'username': body.username,
            'loginTime': new Date(),
            'token': body.token,
            'userIP': userIP
        }
        const session = new Session(json);
        await session.save();
        return 'Session logged in'
    } else {
        return session
    }
}

async function logout(body, userIP) {
    const token = body.token;
    const session = await Session.findOne({token: token});
    if (!session) {
        return 'No such session'
    } else {
        let sessionJSON = {
            'logoutTime': new Date()
        }
        Object.assign(session, sessionJSON);
        await session.save();
        return 'Session logged out'
    }
}