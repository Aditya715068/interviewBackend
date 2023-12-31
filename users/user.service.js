﻿const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;
const Session = db.Session;
const UserRole = db.UserRole;
module.exports = {
    audit,
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function audit(body) {
    // let token = body.token;
    // const authenticated = await Session.findOne({token: token});
    // const getRole = await UserRole.findOne({username: authenticated.username});
    // if (authenticated && authenticated.logoutTime === undefined ) {
        const userList = await Session.find();
        return userList;
    // } else {
    //     return 'Not authenticated to get the list';
    // }
}

async function authenticate({ username, password }, req) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
       
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
    // const session = await Session.findOne({});
     let json = {
        'username': username,
        'loginTime': new Date(),
        'token': token,
        'userIP': req.connection.remoteAddress
       
    }
    const session = new Session(json);
    await session.save();
        
        
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    console.log(userParam)
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}