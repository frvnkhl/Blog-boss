const passport = require('passport');
const UserService = require('../services/userService');

exports.registerUser = (req, res, next) => {
    passport.authenticate('register', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
            res.status(400).send(err);
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(400).send(info.message);
        } else {
            await UserService.registerUser(req, user);
            res.status(200).send({ message: 'User created' });
        }
    })(req, res, next);
};

exports.loginUser = (req, res, next) => {
    passport.authenticate('login', async (err, users, info) => {
        if (err) {
            console.error({ message: err });
            res.status(400).send({ message: err });
        }
        if (info !== undefined) {
            console.error({ message: info.message });
            if (info.message === 'bad username') {
                res.status(401).send({ message: info.message });
            } else {
                res.status(403).send({ message: info.message });
            }
        } else {
            const token = await UserService.loginUser(req, users);
            res.status(200).send({
                auth: true,
                token: token,
                message: 'User found & logged in',
            });
        };

    })(req, res, next);
};

exports.logoutUser = async (req, res) => {
    await req.logout();
};

exports.getMyProfile = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log({ authError: err });
            res.status(400).send({ authError: err });
        };
        if (info !== undefined) {
            console.log({ authError: info.message });
            res.status(400).send(info.message);
        } else {
            const foundUser = await UserService.showProfile(user);
            res.status(200).send(foundUser);
        }
    })(req, res, next);
};

exports.getProfile = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log({ authError: err });
            res.status(400).send({ authError: err });
        }
        if (info !== undefined) {
            console.log({ authError: info.message });
            res.status(400).send(info.message);
        } else {
            const userId = req.params.id;
            const foundUser = await UserService.getUser(userId);
            // console.log({ foundUserInController: foundUser });
            if (foundUser) {
                res.status(200).send(foundUser);
            } else {
                res.status(404).send({ message: 'User not found' });
            }
        }
    })(req, res, next);
};

exports.changePassword = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log({ authError: err });
            res.status(400).send({ authError: err });
        }
        if (info !== undefined) {
            console.log({ authError: info.message });
            res.status(400).send(info.message);
        } else {
            const response = await UserService.passwordChange(req, user);
            if (response.acknowledged) {
                res.status(200).send({ message: 'Password changes successfully!' });
            } else {
                res.status(400).send({ message: 'Something went wrong' });
            }
        }
    })(req, res, next);
};

exports.changeAvatar = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.log({ authError: err });
        }
        if (info !== undefined) {
            console.log({ authError: info.message });
            res.send(info.message);
        } else {
            const newAvatar = req.body.avatar;
            const response = await UserService.avatarChange(user, newAvatar);
            response.modifiedCount !== 0 ?
                res.status(200).send({ message: 'Avatar changes successfully' }) :
                res.status(400).send({ message: 'Something went wrong' });
        }
    })(req, res, next);
};

exports.authGoogleCallback = (req, res, next) => {
    
};
