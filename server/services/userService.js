const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 12;

exports.registerUser = async (req, user) => {
    req.logIn(user, async () => {
        const data = {
            userEmail: req.body.email,
            username: req.body.username,
            password: req.body.password
        };
        await User.findOne({ username: data.username }).then(user => {
            user.email = data.userEmail;
        }).then(() => {
            console.log('user created in db');
        });
    });
};

exports.loginUser = async (req, users) => {
    req.logIn(users, () => {
        User.findOne({ username: req.body.username });
    });

    const getUserToken = async () => {
        const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
        });
        return token;
    }
    return getUserToken();
};

exports.showProfile = async (user) => {
    return formatUser(user);
};

exports.getUser = async (id) => {
    return await User.findById(mongoose.Types.ObjectId(id))
        .then(user => formatUser(user));
};

exports.passwordChange = async (req, user) => {
    const password = req.body.password;
    console.log({ newPass: password });
    const response = bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
        .then(hashedPassword => {
            console.log({ hashedPass: hashedPassword });
            return User.updateOne({ _id: user._id }, { password: hashedPassword });
        });

    const getResponse = async () => {
        const res = await response;
        return res;
    }
    return getResponse();
};

exports.avatarChange = async (user, avatar) => {
    return await User.updateOne({ _id: user._id }, { avatar: avatar });
};

const formatUser = (user) => {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        favouriteArticles: user.favouriteArticles,
        following: user.following,
        followers: user.followers
    };
};