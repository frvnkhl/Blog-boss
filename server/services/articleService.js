const Article = require('../models/articleModel');
const { Comment } = require('../models/commentModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

exports.createArticle = (article, user) => {
    const newArticle = new Article({
        author: user._id,
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags
    });

    newArticle.save();
    return newArticle;
};

exports.getArticle = async (id) => {
    return await Article.findById(mongoose.Types.ObjectId(id));
};

exports.getAllArticles = async () => {
    return await Article.find({});
};

exports.editArticle = async (id, partsToUpdate, user) => {
    return await Article.updateOne({ '_id': id, 'author': user._id }, { $set: partsToUpdate });
};

exports.deleteArticle = async (id, user) => {
    return await Article.deleteOne({ '_id': id, 'author': user._id });
};

exports.addComment = async (id, user, comment) => {
    const article = await Article.findById(mongoose.Types.ObjectId(id));

    const newComment = new Comment({
        author: user._id,
        comment: comment
    });
    article.comments.push(newComment);
    article.save();
    return newComment;
};

exports.deleteComment = async (id, user, commentId) => {
    const article = await Article.findById(mongoose.Types.ObjectId(id));
    const commentToDelete = article.comments.find(comment => comment._id === commentId);
    if (commentToDelete.author === user._id || commentToDelete.author === article.author) {
        const commentIndex = article.comments.indexOf(commentToDelete);
        article.comments.splice(commentIndex, 1);
        article.save();
        return true;
    }
    return false;
};

//TODO test this method & later add avatar to it
exports.getArticleLikes = async (id) => {
    const userList = await User.find({ favouriteArticles: { $all: [mongoose.Types.ObjectId(id)] } });
    const formattedUsers = [];

    userList.forEach(user => formattedUsers.push({username: user.username}));
    return formattedUsers;
}