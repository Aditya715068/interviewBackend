const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String },
    createdDate: { type: Date, default: Date.now() },
    loginTime: {type: Date},
    logoutTime: {type: Date},
    userIP: {type: String},
    token: {type: String, unique: false}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Session', schema);