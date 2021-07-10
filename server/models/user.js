const mongoose = require('mongoose');
const crypto = require('crypto');
// user schema
const userScheama = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String, //  to show how strong the password is
        role: {
            type: String,
            default: 'subscriber'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        }
    }, 
{ timestamps: true } // created at and updated at timestamps will be created.
    );

// virtuals
userScheama.virtual('password')
.set(function(password){
this._password = password
this.salt = this.makeSalt()
this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

// methods
userScheama.methods = {

    authenticate: function(password) {
        return this.encryptPassword(password) === this.hashed_password; // true false
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
}

module.exports = mongoose.model('User', userScheama);