const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');
const config = require('../config/config');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: String,
    lastname: String,
    activated: Boolean,
    messages: [{
        author: String,
        body: String,
        date: Date,
    }],
    whoami: String,
    school: {type: Schema.Types.ObjectId, ref: 'School', default: null}
}, { timestamps: true });
  
userSchema.methods = {
    authenticate: function (password) {
        return passwordHash.verify(password, this.password);
    },
    getToken: function () {
        return jwt.encode(this, config.secret);
    }
}
  
module.exports = mongoose.model("User", userSchema);