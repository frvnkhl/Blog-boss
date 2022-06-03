const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 12;

exports.registerUser = async (req, user) => {
    req.logIn(user, async () => {
        console.log(user);
        const data = {
            userEmail: req.body.email,
            username: req.body.username,
            password: req.body.password
        };
        console.log(data);
        await User.findOne({ username: data.username }).then(user => {
            console.log(user);
            user.email = data.userEmail;
        }).then(() => {
            console.log('user created in db');
        });
    });
}

exports.loginUser = async (req, users) => {
    req.logIn(users, async () => {
        await User.findOne({ username: req.body.username }).then(user => {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60,
            });
            user.token = token;
            user.save();
        });
    });
}

exports.showProfile = async (user) => {
    return formatUser(user);
}

exports.getUser = async (id) => {
    return await User.findById(mongoose.Types.ObjectId(id))
        .then(user => formatUser(user));
}

exports.passwordChange = async (user, password) => {
    const response = bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then(hashedPassword => {
            return User.updateOne({ _id: user._id }, { password: hashedPassword });
        });

    const getResponse = async () => {
        const res = await response;
        console.log({ response: res });
        return res;
    }

    return getResponse();
}

const formatUser = (user) => {
    return {
        username: user.username,
        email: user.email,
        favourteArticles: user.favourteArticles,
        following: user.following,
        followers: user.followers
    };
};