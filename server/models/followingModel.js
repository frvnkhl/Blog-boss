const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const ObjectId = mongoose.Types.ObjectId;

const followingSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    following: [{
        type: ObjectId,
        ref: 'User'
    }]
});

followingSchema.plugin(findOrCreate);

module.exports = mongoose.model('Following', followingSchema);