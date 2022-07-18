const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const ObjectId = mongoose.Types.ObjectId;

const followingSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    following: {
        type: [ObjectId],
        ref: 'User'
    }
});

followingSchema.plugin(findOrCreate);

const Following = mongoose.model('Following', followingSchema);

module.exports = { followingSchema, Following };