const express = require('express')

const router = express.Router()
const homeController = require('../controller/home_controllers');

router.post('/add-comment', homeController.add_comment);

router.post('/add-share', homeController.add_share);

router.post('/add-tag', homeController.add_tag);

router.post('/add-post-report', homeController.add_post_report);

router.post('/add-user-report', homeController.add_user_report);

router.post('/delete-comment', homeController.delete_comment);

router.post('/like-dislike-post', homeController.like_dislike_post);

router.post('/like-dislike-comment', homeController.like_dislike_comment);

router.post('/save-unsave-post', homeController.save_unsave_post);

router.get('/homescreen-feed', homeController.homescreen_feed);

router.get('/post-comment-list', homeController.post_comment_list);

router.get('/post-like-list', homeController.post_like_list);

router.post('/follow-following', homeController.follow_following);

router.get('/user-profile', homeController.user_profile);

router.get('/following-list', homeController.following_list);

router.get('/follower-list', homeController.follower_list);

router.get('/block-user', homeController.block_user);

router.post('/create-poll', homeController.create_poll);

router.post('/add-poll-vote', homeController.add_poll_vote);

router.get('/poll-listing', homeController.poll_listing);

router.get('/people-poll-listing', homeController.people_poll_listing);


module.exports = router;
