const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const followerSchema = mongoose.Schema({
    userId: String,
    follower: [String]
});

followerSchema.plugin(findOrCreate);

module.exports = mongoose.model('Follower', followerSchema);