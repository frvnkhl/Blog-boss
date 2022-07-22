const { Follower } = require('../models/followerModel');
const { Following } = require('../models/followingModel');
const { User } = require('../models/userModel');
const mongoose = require('mongoose');

exports.changeFollowStatus = async (user, userId) => {
    console.log({ userId: userId, user: user._id });
    await Following.findOrCreate({ userId: user._id }, async (err, following, created) => {
        console.log({following: following});
        if (!err && !isFollowing(following, userId)) {
            following.following.push(mongoose.Types.ObjectId(userId));
            following.save();
            await User.updateOne({'_id': userId}, {$inc: {followers: 1}});
        } else {
            const followingIndex = following.following.indexOf(mongoose.Types.ObjectId(userId));
            following.following.splice(followingIndex, 1);
            following.save();
            await User.updateOne({ '_id': userId }, { $inc: { followers: -1 } });
        }
    });
    await Follower.findOrCreate({ userId: mongoose.Types.ObjectId(userId) }, async (err, follower, created) => {
        console.log({follower: follower});
        if (!err && !isFollower(follower, user._id)) {
            follower.follower.push(user._id);
            follower.save();
            await User.updateOne({ '_id': user._id }, { $inc: { following: 1 } });
        } else {
            const followerIndex = follower.follower.indexOf(user._id);
            follower.follower.splice(followerIndex, 1);
            follower.save();
            await User.updateOne({ '_id': user._id }, { $inc: { following: -1 } });
        }
    });
};

exports.showFollowings = async (userId) => {
    const followings = await Following.findOrCreate({ userId: mongoose.Types.ObjectId(userId) });

    return followings.doc.following;
};

exports.showFollowers = async (userId) => {
    const followers = await Follower.findOrCreate({ userId: mongoose.Types.ObjectId(userId) });
    console.log({followers: followers});

    return followers.doc.follower;
};

const isFollowing = (newFollowing, userId) => {
    return newFollowing.following.includes(mongoose.Types.ObjectId(userId));
};

const isFollower = (newFollower, userId) => {
    return newFollower.follower.includes(userId);
}