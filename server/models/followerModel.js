const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const ObjectId = mongoose.Types.ObjectId;

const followerSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    follower: [{
        type: ObjectId,
        ref: 'User'
    }]
});

followerSchema.plugin(findOrCreate);

module.exports = mongoose.model('Follower', followerSchema);