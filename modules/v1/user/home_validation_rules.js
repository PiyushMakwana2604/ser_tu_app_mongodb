const checkValidatorRules = {
    addCommentValidation: {
        post_id: "required",
        comment: "required"
    },

    shareValidation: {
        post_id: "required",
        receiver_id: "required"
    },

    tagValidation: {
        post_id: "required",
        tag_id: "required"
    },

    postreportValidation: {
        post_id: "required",
        report_type: "required"
    },

    userReportValidation: {
        report_id: "required",
        report_type: "required"
    },

    deleteCommentValidation: {
        comment_id: "required"
    },

    likeDislikePostValidation: {
        post_id: "required"
    },

    likeDislikeCommentValidation: {
        comment_id: "required"
    },

    saveunsavePostValidation: {
        post_id: "required"
    },

    postCommentListValidation: {
        post_id: "required"
    },

    postlikeListValidation: {
        post_id: "required"
    },

    followFollowingValidation: {
        follow_id: "required"
    },

    userProfileValidation: {
        userId: "required"
    },

    followingListValidation: {
        follow_id: "required"
    },

    followerListValidation: {
        follow_id: "required"
    },

    blockUserValidation: {
        block_id: "required"
    },
    createPollValidation: {
        question: "required",
        option_1: "required",
        option_2: "required"
    },
    addPollVoteValidation: {
        poll_id: "required",
        vote: "required"
    },
    PeoplePollListValidation: {
        poll_id: "required"
    },
}

module.exports = checkValidatorRules;
