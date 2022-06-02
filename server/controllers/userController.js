const passport = require('passport');
const UserService = require('../services/userService');

exports.registerUser = (req, res, next) => {
    passport.authenticate('register', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            await UserService.registerUser(req, user);
            res.status(200).send({ message: 'user created' });
        }
    })(req, res, next);
};

exports.loginUser = (req, res, next) => {
    passport.authenticate('login', async (err, users, info) => {
        if (err) {
            console.error({ authError: err });
        }
        if (info !== undefined) {
            console.error({ authError: info.message });
            if (info.message === 'bad username') {
                res.status(401).send(info.message);
            } else {
                res.status(403).send(info.message);
            }
        } else {
            await UserService.loginUser(req, users);
            res.status(200).send({
                auth: true,
                message: 'user found & logged in',
            });
        }
    })(req, res, next);
};

exports.logoutUser = async (req, res) => {
    await req.logout();
};

exports.getProfile = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log({ authError: err });
        };
        if (info !== undefined) {
            console.log({ authError: info.message });
            res.send(info.message);
        } else {
            const foundUser = await UserService.showProfile(user);
            res.status(200).send(foundUser);
        }
    })(req, res, next);
};


