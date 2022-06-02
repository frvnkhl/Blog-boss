const mongoose = require('mongoose');
const Comment = require('./commentModel');

const articleSchema = mongoose.Schema({
    author: String,
    category: [String],
    tags: [String],
    comments: [Comment],
    likes: Number,
});

module.exports = mongoose.model('Article', articleSchema);