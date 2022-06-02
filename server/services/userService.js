const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, user) => {
    req.logIn(user, async() => {
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
    req.logIn(users, async() => {
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
    return await formatUser(user);
}

const formatUser = async (user) => {
    return {
        username: user.username,
        email: user.email,
        favourtieArticles: user.favourtieArticles,
        following: user.following,
        followers: user.followers
    };
};