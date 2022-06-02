const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

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

    favouriteArticles: [String],
    //TODO: implement additional collection for followings based on https://stackoverflow.com/a/14459370/17273831
    following: [String],
    followers: {
        type: Number,
        default: 0
    },
    token: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);