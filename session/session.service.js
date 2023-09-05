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
    console.log("hello aditya ----------------------------------")
    const session = await Session.findOne({token: token});
    if (!token) {
        // const user = await User.findOne({ username: body.firstName });
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
        return token
    }
}

async function logout(body, userIP) {
    const token = body.token;
    console.log("hello",body.data.username )
    const session = await Session.findOne({token: token});
    if (!session) {
        console.log('No such session')
        return 'No such session'
    } else {
   const regex = /"username":"(.*?)"/;
   const match = body.data&& body.data.length?body.data.match(regex):null;
   
   if (match) {
     const roleValue = match[1]; // Extract the value of the "role" property
     console.log(roleValue); // This will log "Auditor"
   var data = roleValue
   } else {
     console.log('Role property not found.');
   }
        let sessionJSON = {
            'username': data,
            'userIP': userIP,
            'token':"token",
            'logoutTime': new Date()
        }
        // console.log(new Date())
      // Object.assign(session, sessionJSON)
     const session = new Session(sessionJSON);
        await session.save();
        return 'Session logged out'
    }
}