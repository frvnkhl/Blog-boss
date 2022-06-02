const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    author: String,
    comment: String,
    likes: [String]
});

module.exports = mongoose.model('Comment', commentSchema);