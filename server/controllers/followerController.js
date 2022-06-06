const passport = require('passport');
const FollowerService = require('../services/followerService');

exports.changeFollowingStatus = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const userToFollow = req.params.userId;
            await FollowerService.changeFollowStatus(user, userToFollow);
            res.status(200).send({ message: 'success' })
        }
    })(req, res, next);
};

exports.showFollowings = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const followingsOfUser = req.params.userId;
            const followings = await FollowerService.showFollowings(followingsOfUser);
            res.status(200).send(followings);
        }
    })(req, res, next);
};

exports.showFollowers = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const followersOfUser = req.params.userId;
            const followers = await FollowerService.showFollowers(followersOfUser);
            res.status(200).send(followers);
        }
    })(req, res, next);
};