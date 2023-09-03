const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    loginTime: {type: Date, require: true},
    logoutTime: {type: Date},
    userIP: {type: String},
    token: {type: String, unique: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Session', schema);