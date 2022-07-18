const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = mongoose.Schema({
    author: {
        type: ObjectId,
        ref: 'User'
    },
    comment: String,
    likes: {
        type: [ObjectId],
        ref: 'User'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    Comment,
    commentSchema
}