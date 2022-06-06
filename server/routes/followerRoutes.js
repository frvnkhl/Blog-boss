const express = require('express');
const FollowerController = require('../controllers/followerController');
require('../authentication/authStrategies');

const router = express.Router();

router.patch('/:id', FollowerController.changeFollowingStatus);
router.get('/:id/allFollowings', FollowerController.showFollowings);
router.get('/:id/allFollowers', FollowerController.showFollowers);

module.exports = router;