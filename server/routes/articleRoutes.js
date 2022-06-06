const express = require('express');
const ArticleController = require('../controllers/articleController');
require('../authentication/authStrategies');

const router = express.Router();

router.post('/', ArticleController.addArticle);
router.get('/', ArticleController.getAllArticles);
router.get('/:id', ArticleController.getArticle);
router.patch('/:id', ArticleController.editArticle);
router.delete('/:id', ArticleController.deleteArticle);
router.post('/:id/newComment', ArticleController.addComment);
router.delete('/:id/:commentId', ArticleController.deleteComment);
router.get('/:id/likes', ArticleController.getArticleLikes);
router.get('/:id/like', ArticleController.likeArticle);
router.get('/:id/:commentId/like', ArticleController.likeComment);

module.exports = router;