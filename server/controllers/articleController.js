const passport = require('passport');
const ArticleService = require('../services/articleService');

exports.addArticle = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const article = req.body;
            const createdArticle = ArticleService.createArticle(article, user);
            res.status(200).send({
                article: createdArticle,
            })
        }
    })(req, res, next);
};

exports.getArticle = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const articleId = req.params.id;
            const article = await ArticleService.getArticle(articleId);
            res.status(200).send({ article: article });
        }
    })(req, res, next);
};

exports.getAllArticles = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const articles = await ArticleService.getAllArticles();
            res.status(200).send({ articles: articles });
        }
    })(req, res, next);
};

exports.editArticle = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const articleId = req.params.id;
            const partsToUpdate = req.body;
            const response = await ArticleService.editArticle(articleId, partsToUpdate, user);

            response.modifiedCount !== 0 ?
                res.status(200).send({ message: 'Article updated successfully' }) :
                res.status(400).send({ message: "Couldn't edit article" });
        }
    })(req, res, next);
};

exports.deleteArticle = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const articleId = req.params.id;
            const response = await ArticleService.deleteArticle(articleId, user);

            response.deletedCount !== 0 ?
                res.status(200).send({ message: 'Article deleted successfully' }) :
                res.status(400).send({ message: "Couldn't delete article" });
        }
    })(req, res, next);
};

exports.getArticleLikes = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const articleId = req.params.id;
            const userList = await ArticleService.getArticleLikes(articleId);

            res.status(200).send({likes: userList});
        }
    })(req, res, next);
};

exports.addComment = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const articleId = req.params.id;
            const comment = req.body.comment;

            try {
                const createdComment = await ArticleService.addComment(articleId, user, comment);
                res.status(200).send({message:'Comment added', comment: createdComment});
            } catch (err) {
                res.status(400).send({message: "Couldn't add comment"});
            }
        }
    })(req, res, next);
};

exports.deleteComment = async (req, res, next) => {
    passport.authenticate('jwt', async (err, user, info) => {
        if (err) {
            console.error({ authError: err });
        };
        if (info !== undefined) {
            console.error({ authError: info.message });
            res.status(403).send(info.message);
        } else {
            const articleId = req.params.id;
            const commentId = req.params.commentId;

            try {
                const commentDeleted = await ArticleService.deleteComment(articleId, user, commentId);
                commentDeleted ? res.status(200).send({ message: 'Comment deleted successfully'}) :
                res.status(403).send({message: "You don't have rights to delete this comment"});
            } catch (err) {
                res.status(400).send({ message: "Couldn't delete comment" });
            }
        }
    })(req, res, next);
}
