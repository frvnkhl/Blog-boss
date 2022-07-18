const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    googleId: String,
    facebookId: String,

    favouriteArticles: {
        type: [ObjectId],
        ref: 'Article'
    },
    following: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    avatar: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = { userSchema, User };