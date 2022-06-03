const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const followingSchema = mongoose.Schema({
    userId: String,
    following: [String]
});

followingSchema.plugin(findOrCreate);

module.exports = mongoose.model('Following', followingSchema);