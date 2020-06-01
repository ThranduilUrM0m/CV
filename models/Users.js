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
    passwordResetToken: String,
    passwordResetExpires: Date,
    fingerprint: String,
    roles: [{ type: 'String' }],
    isVerified: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

userSchema.methods = {
    authenticate: function (password) {
        return passwordHash.verify(password, this.password);
    },
    getToken: function () {
        return jwt.encode(this, config.secret);
    }
}

userSchema.index({updatedAt: 1}, {expireAfterSeconds : 60*60*24*7, partialFilterExpression : { roles: { $eq: 'Deleted'} }})
module.exports = mongoose.model("User", userSchema);