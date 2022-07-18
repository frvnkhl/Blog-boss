const mongoose = require('mongoose');
const { commentSchema } = require('./commentModel');
const ObjectId = mongoose.Schema.Types.ObjectId;

const articleSchema = mongoose.Schema({
    author: {
        type: ObjectId,
        ref: 'User'
    },
    title: String,
    content: String,
    category: {
        type: [String],
        enum: ['food', 'travel', 'technology', 'society', 'health', 'lifestyle', 'fashion', 'art']
    },
    tags: [String],
    comments: [commentSchema],
    likes: {
        type: Number,
        default: 0
    },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = { articleSchema, Article };