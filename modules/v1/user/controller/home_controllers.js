const homeModel = require("../models/home_model");
const Codes = require("../../../../config/status_codes");
const middleware = require("../../../../middleware/headerValidator");
const validationRules = require('../home_validation_rules');

const add_comment = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.addCommentValidation)

    if (valid.status) {
        return homeModel.add_comment(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const add_share = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.shareValidation)

    if (valid.status) {
        return homeModel.add_share(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const add_tag = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.tagValidation)

    if (valid.status) {
        return homeModel.add_tag(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const add_post_report = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.postreportValidation)

    if (valid.status) {
        return homeModel.add_post_report(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const add_user_report = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.userReportValidation)

    if (valid.status) {
        return homeModel.add_user_report(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const delete_comment = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.deleteCommentValidation)

    if (valid.status) {
        return homeModel.delete_comment(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const like_dislike_post = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.likeDislikePostValidation)

    if (valid.status) {
        return homeModel.like_dislike_post(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const like_dislike_comment = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.likeDislikeCommentValidation)

    if (valid.status) {
        return homeModel.like_dislike_comment(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const save_unsave_post = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.saveunsavePostValidation)

    if (valid.status) {
        return homeModel.save_unsave_post(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const homescreen_feed = async (req, res) => {
    return homeModel.homescreen_feed(req, res)
}

const post_comment_list = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.postCommentListValidation)

    if (valid.status) {
        return homeModel.post_comment_list(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const post_like_list = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.postlikeListValidation)

    if (valid.status) {
        return homeModel.post_like_list(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const follow_following = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.followFollowingValidation)

    if (valid.status) {
        return homeModel.follow_following(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const user_profile = async (req, res) => {
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.userProfileValidation)

    if (valid.status) {
        return homeModel.user_profile(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const following_list = async (req, res) => {
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.followingListValidation)

    if (valid.status) {
        return homeModel.following_list(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const follower_list = async (req, res) => {
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.followerListValidation)

    if (valid.status) {
        return homeModel.follower_list(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const block_user = async (req, res) => {
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.blockUserValidation)

    if (valid.status) {
        return homeModel.block_user(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const create_poll = async (req, res) => {
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.createPollValidation)

    if (valid.status) {
        return homeModel.create_poll(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const add_poll_vote = async (req, res) => {
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.addPollVoteValidation)

    if (valid.status) {
        return homeModel.add_poll_vote(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const poll_listing = async (req, res) => {
    return homeModel.poll_listing(req, res)
}

const people_poll_listing = async (req, res) => {
    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.PeoplePollListValidation)

    if (valid.status) {
        return homeModel.people_poll_listing(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

module.exports = {
    add_comment, delete_comment, like_dislike_post,
    homescreen_feed, save_unsave_post, post_comment_list, post_like_list,
    add_share, add_tag, add_post_report, add_user_report,
    like_dislike_comment, follow_following, user_profile,
    following_list, follower_list, block_user,
    create_poll, add_poll_vote, poll_listing, people_poll_listing
}