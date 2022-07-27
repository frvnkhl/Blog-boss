const { Article } = require('../models/articleModel');
const { Comment } = require('../models/commentModel');
const { User } = require('../models/userModel');
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
    const allComments = article.comments;
    const commentToDelete = allComments.filter(comment => comment.id === commentId);
    console.log({ article: article, userId: user._id, comment: commentToDelete[0] });
    if (commentToDelete[0].author.equals(user._id) || commentToDelete[0].author.equals(article.author)) {
        const commentIndex = article.comments.indexOf(commentToDelete[0]);
        article.comments.splice(commentIndex, 1);
        article.save();
        return true;
    } else {
        return false;
    }
};

exports.getArticleLikes = async (id) => {
    const userList = await User.find({ favouriteArticles: { $all: [mongoose.Types.ObjectId(id)] } });
    const formattedUsers = [];

    userList.forEach(user => formattedUsers.push({ username: user.username, avatar: user.avatar }));
    return formattedUsers;
};

exports.likeArticle = async (id, user) => {
    const article = await Article.findById(id);
    if (isFavourite(id, user)) {
        article.likes -= 1;
        article.save();
        const articleIndex = user.favouriteArticles.indexOf(id);
        user.favouriteArticles.splice(articleIndex, 1);
        user.save();
    } else {
        article.likes += 1;
        article.save();
        user.favouriteArticles.push(id);
        user.save();
    }
};

exports.likeComment = async (id, commentId, user) => {
    const article = await Article.findById(mongoose.Types.ObjectId(id));
    const allComments = article.comments;
    const comment = allComments.filter(comment => comment.id === commentId);
    console.log({ comment: comment[0] });
    if (isCommentLiked(comment[0], user)) {
        const userIndex = comment[0].likes.indexOf(user._id);
        comment[0].likes.splice(userIndex, 1);
        article.save();
    } else {
        comment[0].likes.push(user._id);
        article.save();
    }
};

const isFavourite = (id, user) => {
    return user.favouriteArticles.includes(mongoose.Types.ObjectId(id));
};

const isCommentLiked = (comment, user) => {
    const likes = comment.likes;
    return likes.includes(user._id) ? true : false;
};