const { Follower } = require('../models/followerModel');
const { Following } = require('../models/followingModel');
const mongoose = require('mongoose');

exports.changeFollowStatus = async (user, userId) => {
    const newFollowing = await Following.findOrCreate({ userId: user._id });
    const newFollower = await Follower.findOrCreate({ userId: mongoose.Types.ObjectId(userId) });
    if (!isFollowing) {
        newFollowing.following.push(mongoose.Types.ObjectId(userId));
        newFollower.follower.push(user._id);
    } else {
        const followingIndex = newFollowing.following.indexOf(mongoose.Types.ObjectId(userId));
        const followerIndex = newFollower.follower.indexOf(user._id);

        newFollowing.following.splice(followingIndex, 1);
        newFollower.follower.splice(followerIndex, 1);

        newFollowing.save();
        newFollower.save();
    }
};

exports.showFollowings = async (userId) => {
    const followings = await Following.findOrCreate({ userId: mongoose.Types.ObjectId(userId) });

    return followings.following;
};

exports.showFollowers = async (userId) => {
    const followers = await Follower.findOrCreate({ userId: mongoose.Types.ObjectId(userId) });

    return followers.follower;
};

const isFollowing = (newFollowing, userId) => {
    return newFollowing.following.includes(mongoose.Types.ObjectId(userId));
};