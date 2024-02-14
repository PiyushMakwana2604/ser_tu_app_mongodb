const randtoken = require('rand-token').generator();
const common = require("../../../../config/common");
const lang = require("../../../../config/language");
const Codes = require("../../../../config/status_codes");
const CommentSchema = require("../../../schema/comment_schema");
const ShareSchema = require("../../../schema/share_schema");
const PostSchema = require("../../../schema/post_schema");
const PostlikeSchema = require("../../../schema/post_like_schema");
const CommentlikeSchema = require("../../../schema/comment_like_schema");
const PostsaveSchema = require("../../../schema/post_save_schema");
const PostTagSchema = require("../../../schema/post_tag_schema");
const PostReportSchema = require("../../../schema/post_report_schema");
const UserReportSchema = require("../../../schema/user_report_schema");
const UserSchema = require("../../../schema/user_schema");
const PollSchema = require("../../../schema/poll_schema");
const PollVoteSchema = require("../../../schema/poll_vote_schema");
const FollowFollowingSchema = require("../../../schema/follow_following_schema");
const BlockUserSchema = require("../../../schema/block_user_schema");
const middleware = require("../../../../middleware/headerValidator");
const template = require("../../../../config/template");
const redis = require("../../../../config/redis");
const { error, log } = require('winston');
const mongoose = require('mongoose');
var asyncLoop = require("node-async-loop");


const homeModel = {
    async add_comment(req, res) {
        let params = {
            user_id: req.user_id,
            post_id: req.post_id,
            comment: req.comment
        };
        if ((req.parent_id != undefined) && req.parent_id != "") {
            params.parent_id = req.parent_id
        }
        const newComment = new CommentSchema(params);
        newComment.validate().then(() => {
            newComment.save().then(response => {
                return PostSchema.updateOne(
                    { _id: req.post_id },
                    { $inc: { comment_count: 1 } }
                )
                    .then(() => {
                        return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_add_comment_success_message, response);
                    })
                    .catch(error => {
                        return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
                    })
            }).catch((error) => {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
            });
        }).catch((error) => {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keywords_err_message, error);
        });
    },

    async add_share(req, res) {
        async function processShares() {
            await new Promise((resolve, reject) => {
                asyncLoop(req.receiver_id, function (item, next) {
                    let params = {
                        post_id: req.post_id,
                        sender_id: req.user_id,
                        receiver_id: item
                    };
                    const newShare = new ShareSchema(params);
                    newShare.save().then(async response => {
                        let update_count = await PostSchema.updateOne(
                            { _id: req.post_id },
                            { $inc: { share_count: 1 } }
                        );
                        if (update_count.modifiedCount <= 0) {
                            reject(lang[req.language].rest_keywords_err_message);
                        } else {
                            next();
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            const post = await PostSchema.findOne({ _id: req.post_id });
            const share_count = {
                share_count: post.share_count
            };
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_add_share_success_message, share_count);
        }
        processShares()
            .catch((error) => {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
            });
        // let receiverId = req.receiver_id
        // req.receiver_id.forEach(receiver_id => {
        //     let params = {
        //         post_id: req.post_id,
        //         sender_id: req.user_id,
        //         receiver_id: receiver_id
        //     };
        //     const newShare = new ShareSchema(params);
        //     newShare.save().then(async response => {
        //         let update_count = await PostSchema.updateOne(
        //             { _id: req.post_id },
        //             { $inc: { share_count: 1 } }
        //         )
        //         if (update_count.modifiedCount <= 0) {
        //             return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        //         }
        //         const post = await PostSchema.findOne({ _id: req.post_id })
        //         const share_count = {
        //             share_count: post.share_count
        //         }
        //         return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_add_share_success_message, share_count);
        //     }).catch((error) => {
        //         return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
        //     });
        // })
    },

    async add_tag(req, res) {
        async function processTags() {
            await new Promise((resolve, reject) => {
                asyncLoop(req.tag_id, function (item, next) {
                    let params = {
                        post_id: req.post_id,
                        tag_id: item
                    };
                    const newTag = new PostTagSchema(params);
                    newTag.save().then(async response => {
                        let update_count = await PostSchema.updateOne(
                            { _id: req.post_id },
                            { $inc: { tag_count: 1 } }
                        );
                        if (update_count.modifiedCount <= 0) {
                            reject(lang[req.language].rest_keywords_err_message);
                        } else {
                            next();
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            const post = await PostSchema.findOne({ _id: req.post_id });
            const tag_count = {
                tag_count: post.tag_count
            };
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_add_tag_success_message, tag_count);
        }
        processTags().catch((error) => {
            return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
        });
    },

    async add_post_report(req, res) {
        let params = {
            user_id: req.user_id,
            post_id: req.post_id,
            report_type: req.report_type
        };
        if (req.description != undefined && req.description != "") {
            params.description = req.description;
        }
        const newPostreport = new PostReportSchema(params);
        newPostreport.save().then(response => {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_add_postreport_success_message, response);
        }).catch((error) => {
            return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
        });
    },

    async add_user_report(req, res) {
        let params = {
            user_id: req.user_id,
            report_id: req.report_id,
            report_type: req.report_type
        };
        if (req.description != undefined && req.description != "") {
            params.description = req.description;
        }
        const newUserreport = new UserReportSchema(params);
        newUserreport.save().then(response => {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_add_userreport_success_message, response);
        }).catch((error) => {
            return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
        });
    },

    async delete_comment(req, res) {
        const commentDetails = await CommentSchema.findOne({ $and: [{ _id: req.comment_id }, { is_active: "1" }, { is_deleted: "0" }] });
        if (!commentDetails) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
        let update_comment = await CommentSchema.updateOne(
            { _id: req.comment_id },
            { $set: { "is_active": "0" } }
        )
        if (update_comment.modifiedCount <= 0) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
        let update_count = await PostSchema.updateOne(
            { _id: commentDetails.post_id },
            { $inc: { comment_count: -1 } }
        )
        if (update_count.modifiedCount <= 0) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
        const post = await PostSchema.findOne({ _id: commentDetails.post_id })
        const comment_count = {
            comment_count: post.comment_count
        }
        return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_delete_comment_success_message, comment_count);
    },

    async like_dislike_post(req, res) {
        const postDetails = await PostSchema.findOne({ $and: [{ _id: req.post_id }, { is_active: "1" }, { is_deleted: "0" }] });
        if (!postDetails) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
        const postlikeDetails = await PostlikeSchema.findOne({ post_id: req.post_id });

        if (!postlikeDetails) {
            let params = {
                user_id: req.user_id,
                post_id: req.post_id
            };
            const newpost_like = new PostlikeSchema(params);
            newpost_like.save().then(response => {
                return PostSchema.updateOne(
                    { _id: req.post_id },
                    { $inc: { like_count: 1 } }
                ).then(async response => {
                    const post = await PostSchema.findOne({ _id: req.post_id })
                    const like_count = {
                        like_count: post.like_count
                    }
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_like_success_message, like_count);
                }).catch((error) => {
                    return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
                });
            }).catch((error) => {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
            });
        } else {
            // let update_active = "";
            // let update_like_count = "";
            // let success_lang = "";
            // if (postlikeDetails.is_active == "1") {
            //     update_active = "0";
            //     update_like_count = -1;
            //     success_lang = lang[req.language].rest_keywords_dislike_success_message;
            // } else {
            //     update_active = "1";
            //     update_like_count = 1;
            //     success_lang = lang[req.language].rest_keywords_like_success_message;
            // }
            if (postlikeDetails.is_active == "1") {
                let update_post_like = await PostlikeSchema.updateOne(
                    { _id: postlikeDetails.id },
                    { $set: { "is_active": "0" } }
                )
                if (update_post_like.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                let update_count = await PostSchema.updateOne(
                    { _id: req.post_id },
                    { $inc: { like_count: -1 } }
                )
                if (update_count.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                const post = await PostSchema.findOne({ _id: req.post_id })
                const like_count = {
                    like_count: post.like_count
                }
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_dislike_success_message, like_count);
            } else {
                let update_post_like = await PostlikeSchema.updateOne(
                    { _id: postlikeDetails.id },
                    { $set: { "is_active": "1" } }
                )
                if (update_post_like.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                let update_count = await PostSchema.updateOne(
                    { _id: req.post_id },
                    { $inc: { like_count: 1 } }
                )
                if (update_count.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                const post = await PostSchema.findOne({ _id: req.post_id })
                const like_count = {
                    like_count: post.like_count
                }
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_like_success_message, like_count);
            }
        }
    },

    async like_dislike_comment(req, res) {
        const commentlikeDetails = await CommentlikeSchema.findOne({ comment_id: req.comment_id });
        if (!commentlikeDetails) {
            let params = {
                user_id: req.user_id,
                comment_id: req.comment_id
            };
            const newcomment_like = new CommentlikeSchema(params);
            newcomment_like.save().then(response => {
                return CommentSchema.updateOne(
                    { _id: req.comment_id },
                    { $inc: { comment_like_count: 1 } }
                ).then(async response => {
                    const comment = await CommentSchema.findOne({ _id: req.comment_id })
                    const comment_like_count = {
                        comment_like_count: comment.comment_like_count
                    }
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_like_success_message, comment_like_count);
                }).catch((error) => {
                    return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
                });
            }).catch((error) => {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
            });
        } else {
            if (commentlikeDetails.is_active == "1") {
                let update_comment_like = await CommentlikeSchema.updateOne(
                    { _id: commentlikeDetails.id },
                    { $set: { "is_active": "0" } }
                )
                if (update_comment_like.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                let update_count = await CommentSchema.updateOne(
                    { _id: req.comment_id },
                    { $inc: { comment_like_count: -1 } }
                )
                if (update_count.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                const comment = await CommentSchema.findOne({ _id: req.comment_id })
                const comment_like_count = {
                    comment_like_count: comment.comment_like_count
                }
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_dislike_success_message, comment_like_count);
            } else {
                let update_comment_like = await CommentlikeSchema.updateOne(
                    { _id: commentlikeDetails.id },
                    { $set: { "is_active": "1" } }
                )
                if (update_comment_like.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                let update_count = await CommentSchema.updateOne(
                    { _id: req.comment_id },
                    { $inc: { comment_like_count: 1 } }
                )
                if (update_count.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                const comment = await CommentSchema.findOne({ _id: req.comment_id })
                const comment_like_count = {
                    comment_like_count: comment.comment_like_count
                }
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_like_success_message, comment_like_count);
            }
        }
    },

    async save_unsave_post(req, res) {
        const postDetails = await PostSchema.findOne({ $and: [{ _id: req.post_id }, { is_active: "1" }, { is_deleted: "0" }] });
        if (!postDetails) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
        const postsaveDetails = await PostsaveSchema.findOne({ post_id: req.post_id });

        if (!postsaveDetails) {
            let params = {
                user_id: req.user_id,
                post_id: req.post_id
            };
            const newpost_save = new PostsaveSchema(params);
            newpost_save.save().then(response => {
                return PostSchema.updateOne(
                    { _id: req.post_id },
                    { $inc: { save_count: 1 } }
                ).then(async response => {
                    const post = await PostSchema.findOne({ _id: req.post_id })
                    const save_count = {
                        save_count: post.save_count
                    }
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_save_success_message, save_count);
                }).catch((error) => {
                    return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
                });
            }).catch((error) => {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
            });
        } else {
            if (postsaveDetails.is_active == "1") {
                let update_post_save = await PostsaveSchema.updateOne(
                    { _id: postsaveDetails.id },
                    { $set: { "is_active": "0" } }
                )
                if (update_post_save.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                let update_count = await PostSchema.updateOne(
                    { _id: req.post_id },
                    { $inc: { save_count: -1 } }
                )
                if (update_count.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                const post = await PostSchema.findOne({ _id: req.post_id })
                const save_count = {
                    save_count: post.save_count
                }
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_unsave_success_message, save_count);
            } else {
                let update_post_save = await PostsaveSchema.updateOne(
                    { _id: postsaveDetails.id },
                    { $set: { "is_active": "1" } }
                )
                if (update_post_save.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                let update_count = await PostSchema.updateOne(
                    { _id: req.post_id },
                    { $inc: { save_count: 1 } }
                )
                if (update_count.modifiedCount <= 0) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
                const post = await PostSchema.findOne({ _id: req.post_id })
                const save_count = {
                    save_count: post.save_count
                }
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_save_success_message, save_count);
            }
        }
    },

    async homescreen_feed(req, res) {
        let userId = new mongoose.Types.ObjectId(req.user_id);
        const result = await PostSchema.aggregate([
            {
                $lookup: {
                    from: "tbl_user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            // {
            //     $lookup: {
            //         from: "tbl_post_like",
            //         localField: "_id",
            //         foreignField: "post_id",
            //         as: "is_active_like_count"
            //     }
            // },
            {
                $lookup: {
                    from: "tbl_post_like",
                    let: { postId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user_id", userId] },
                                        { $eq: ["$is_active", "1"] },
                                        { $eq: ["$post_id", "$$postId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "like_details"
                }
            },
            {
                $lookup: {
                    from: "tbl_post_save",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "save_details"
                },
            },
            {
                $addFields: {
                    "is_like": {
                        $ifNull: [{ $arrayElemAt: ["$like_details.is_active", 0] }, 0]
                    },
                    "is_save": {
                        $ifNull: [{ $arrayElemAt: ["$save_details.is_active", 0] }, 0]
                    },
                    // "like_details_active_count": {
                    //     $size: {
                    //         $filter: {
                    //             input: "$is_active_like_count",
                    //             as: "likeDetail",
                    //             cond: { $eq: ["$$likeDetail.is_active", "1"] }
                    //         }
                    //     }
                    // }
                }
            },
            {
                $project: {
                    // "like_details_active_count": 1,
                    "user_details.first_name": 1,
                    "user_details.last_name": 1,
                    "is_like": 1,
                    "is_save": 1,
                    "user_id": 1,
                    "comment_count": 1,
                    "like_count": 1,
                    "share_count": 1,
                    "save_count": 1,
                    "tag_count": 1,
                    "description": 1,
                    "hastag": 1,
                    "location": 1,
                    "latitude": 1,
                    "longitude": 1,
                    "post_media": 1,
                    "is_active": 1,
                    "is_deleted": 1,
                    "created_at": 1,
                    "updated_at": 1
                }
            },
        ])
        if (result) {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_get_data_message, result);
        } else {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
    },

    // async post_comment_list(req, res) {
    //     let postId = new mongoose.Types.ObjectId(req.post_id);
    //     let userId = new mongoose.Types.ObjectId(req.user_id);
    //     let result1 = await CommentSchema.find()
    //     for (let i = 0; i < result1.length; i++) {
    //         const element = result1[i];
    //         const user = await UserSchema.findOne({ _id: element.user_id }).select('first_name last_name');

    //         if (user) {
    //             // Create or initialize user_data array if not exists
    //             result1[i].user_data = result1[i].user_data || [];
    //             // Add user details to the user_data array
    //             result1[i].user_data.push({
    //                 first_name: user.first_name,
    //                 last_name: user.last_name
    //             });
    //         } else {
    //             console.log('User not found for user_id:', element.user_id);
    //         }
    //     }
    //     console.log('result1: ', result1);
    //     const result = await CommentSchema.aggregate([
    //         {
    //             $match: {
    //                 post_id: postId,
    //                 is_active: "1",
    //                 is_deleted: "0"
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "tbl_user",
    //                 localField: "user_id",
    //                 foreignField: "_id",
    //                 as: "user_details"
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "tbl_comment_like",
    //                 let: { commentId: "$_id" },
    //                 pipeline: [
    //                     {
    //                         $match: {
    //                             $expr: {
    //                                 $and: [
    //                                     { $eq: ["$user_id", userId] },
    //                                     { $eq: ["$is_active", "1"] },
    //                                     { $eq: ["$comment_id", "$$commentId"] }
    //                                 ]
    //                             }
    //                         }
    //                     }
    //                 ],
    //                 as: "like_details"
    //             }
    //         },
    //         {
    //             $addFields: {
    //                 "is_like": {
    //                     $ifNull: [{ $arrayElemAt: ["$like_details.is_active", 0] }, 0]
    //                 }
    //             }
    //         },
    //         {
    //             $project: {
    //                 "user_details.first_name": 1,
    //                 "user_details.last_name": 1,
    //                 "is_like": 1,
    //                 "user_id": 1,
    //                 "post_id": 1,
    //                 "comment": 1,
    //                 "reply_comment_count": 1,
    //                 "comment_like_count": 1,
    //                 "is_active": 1,
    //                 "is_deleted": 1,
    //                 "created_at": 1,
    //                 "updated_at": 1
    //             }
    //         },
    //     ]);
    //     if (result) {
    //         return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_get_data_message, result);
    //     } else {
    //         return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
    //     }

    // },

    // async post_comment_list(req, res) {
    //     try {
    //         let postId = new mongoose.Types.ObjectId(req.post_id);
    //         let userId = new mongoose.Types.ObjectId(req.user_id);

    //         // Fetch comments using CommentSchema.find()
    //         let comments = await CommentSchema.find();

    //         // Fetch user details for each comment
    //         const commentsWithUserData = await Promise.all(comments.map(async (comment) => {
    //             const user = await UserSchema.findOne({ _id: comment.user_id }).select('first_name last_name');

    //             if (user) {
    //                 return {
    //                     ...comment.toObject(),
    //                     user_data: {
    //                         user_id: comment.user_id,
    //                         first_name: user.first_name,
    //                         last_name: user.last_name
    //                     }
    //                 };
    //             } else {
    //                 console.log('User not found for user_id:', comment.user_id);
    //                 return { ...comment.toObject(), user_data: null };
    //             }
    //         }));

    //         console.log('result1: ', commentsWithUserData);

    //         if (commentsWithUserData.length > 0) {
    //             return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_get_data_message, commentsWithUserData);
    //         } else {
    //             return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
    //         }

    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }

    // ,

    async post_comment_list(req, res) {
        try {
            let postId = new mongoose.Types.ObjectId(req.post_id);
            let userId = new mongoose.Types.ObjectId(req.user_id);

            // Fetch comments using CommentSchema.find()
            let comments = await CommentSchema.find();

            // Fetch user details for each comment sequentially
            const commentsWithUserData = [];

            for (let i = 0; i < comments.length; i++) {
                const comment = comments[i];
                const user = await UserSchema.findOne({ _id: comment.user_id }).select('first_name last_name');

                if (user) {
                    commentsWithUserData.push({
                        ...comment.toObject(),
                        user_data: {
                            user_id: comment.user_id,
                            first_name: user.first_name,
                            last_name: user.last_name
                        }
                    });
                } else {
                    console.log('User not found for user_id:', comment.user_id);
                    commentsWithUserData.push({ ...comment.toObject(), user_data: null });
                }
            }

            console.log('result1: ', commentsWithUserData);

            if (commentsWithUserData.length > 0) {
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_get_data_message, commentsWithUserData);
            } else {
                return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async post_like_list(req, res) {
        let postId = new mongoose.Types.ObjectId(req.post_id);
        const result = await PostlikeSchema.aggregate([
            {
                $match: {
                    post_id: postId,
                    is_active: "1"
                }
            },
            {
                $lookup: {
                    from: "tbl_user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $addFields: {
                    "user_details": {
                        $ifNull: [{ $arrayElemAt: ["$user", 0] }, 0]
                    }
                }
            },
            {
                $project: {
                    "user_details.first_name": 1,
                    "user_details.last_name": 1,
                    "user_details.user_name": 1
                }
            }
        ]);
        return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_get_data_message, result);

    },

    async follow_following(req, res) {
        const FollowFollowingDetails = await FollowFollowingSchema.findOne({ $and: [{ user_id: req.user_id }, { follow_id: req.follow_id }] });
        if (!FollowFollowingDetails) {
            let params = {
                user_id: req.user_id,
                follow_id: req.follow_id,
                status: "accepted"
            };
            const newfollow_following = new FollowFollowingSchema(params);
            newfollow_following.save().then(async response => {
                let data = await homeModel.getFollowingCount(req.user_id);
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_follow_success_message, data);
            }).catch((error) => {
                return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keywords_err_message, error);
            });
        } else {
            let remove = await FollowFollowingSchema.deleteOne({ _id: FollowFollowingDetails._id });
            if (remove.deletedCount > 0) {
                let data = await homeModel.getFollowingCount(req.user_id);
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_unfollow_success_message, data);
            } else {
                return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_unfollow_err_message, null);
            }
        }
    },

    async user_profile(req, res) {
        let Id = new mongoose.Types.ObjectId(req.user_id);
        let userId = new mongoose.Types.ObjectId(req.userId);
        const UserDetails = await UserSchema.aggregate([
            {
                $match: {
                    $and: [
                        { _id: userId },
                        { is_active: "1" },
                        { is_deleted: "0" }
                    ]
                }
            },
            {
                $lookup: {
                    from: "tbl_post",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "user_posts"
                }
            }
        ]);
        let follower = await FollowFollowingSchema.find({ $and: [{ user_id: Id }, { follow_id: userId }, { status: "accepted" }, { is_active: "1" }] });
        let following = await FollowFollowingSchema.find({ $and: [{ user_id: userId }, { follow_id: Id }, { status: "accepted" }, { is_active: "1" }] });

        if (following.length > 0) {
            UserDetails[0].is_following = "1";
        } else {
            UserDetails[0].is_following = "0";
        }
        if (follower.length > 0) {
            UserDetails[0].is_follower = "1";
        } else {
            UserDetails[0].is_follower = "0";
        }
        let following_count = await homeModel.getFollowingCount(req.user_id);
        let follower_count = await homeModel.getFollowerCount(req.user_id);
        let post = await PostSchema.find({ $and: [{ user_id: userId }, { is_active: "1" }, { is_deleted: "0" }] });
        let post_count = post.length
        UserDetails[0].following_count = following_count.following_count;
        UserDetails[0].follower_count = follower_count.follower_count;
        UserDetails[0].post_count = post_count;
        return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_user_profile_success_message, UserDetails);
    },

    async following_list(req, res) {
        let follow_id = new mongoose.Types.ObjectId(req.follow_id);
        // This is for single search
        // let where = {
        //     $match: {
        //         "user_details.user_name": {
        //             $regex: new RegExp(req.search, 'i')
        //         }
        //     }
        // }
        // For multiple search
        let search = {
            $match: {
                $or: [
                    {
                        "user_details.user_name": {
                            $regex: new RegExp(req.search, 'i')
                        }
                    },
                    {
                        "user_details.first_name": {
                            $regex: new RegExp(req.search, 'i')
                        }
                    }
                ]
            }
        }
        const data = await FollowFollowingSchema.aggregate([
            {
                $match: {
                    $and: [
                        { user_id: follow_id },
                        { status: "accepted" },
                        { is_active: "1" }
                    ]
                }
            },
            {
                $lookup: {
                    from: "tbl_user",
                    localField: "follow_id",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            search,
            {
                $unwind: "$user_details"
            },
            {
                $project: {
                    user_id: 1,
                    follow_id: 1,
                    "user_details.first_name": 1,
                    "user_details.last_name": 1,
                    "user_details.user_name": 1
                }
            }
        ]);
        if (data.length > 0) {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_following_list_success_message, data);
        } else {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
    },

    async follower_list(req, res) {
        let follow_id = new mongoose.Types.ObjectId(req.follow_id);
        // This is for single search
        // let where = {
        //     $match: {
        //         "user_details.user_name": {
        //             $regex: new RegExp(req.search, 'i')
        //         }
        //     }
        // }
        // For multiple search
        let search = {
            $match: {
                $or: [
                    {
                        "user_details.user_name": {
                            $regex: new RegExp(req.search, 'i')
                        }
                    },
                    {
                        "user_details.first_name": {
                            $regex: new RegExp(req.search, 'i')
                        }
                    },
                    {
                        "user_details.last_name": {
                            $regex: new RegExp(req.search, 'i')
                        }
                    },
                ]
            }
        }
        const data = await FollowFollowingSchema.aggregate([
            {
                $match: {
                    $and: [
                        { follow_id: follow_id },
                        { status: "accepted" },
                        { is_active: "1" }
                    ]
                }
            },
            {
                $lookup: {
                    from: "tbl_user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            search,
            {
                $unwind: "$user_details"
            },
            {
                $project: {
                    user_id: 1,
                    follow_id: 1,
                    "user_details.first_name": 1,
                    "user_details.last_name": 1,
                    "user_details.user_name": 1
                }
            }
        ]);

        if (data.length > 0) {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_follower_list_success_message, data);
        } else {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
    },

    async block_user(req, res) {
        let user_id = new mongoose.Types.ObjectId(req.user_id);
        let block_id = new mongoose.Types.ObjectId(req.block_id);
        let data = await BlockUserSchema.find({ $and: [{ blocked_from: user_id }, { blocked_to: block_id }] });

        if (data.length > 0) {
            if (data[0].is_active == "1") {
                let update_block = await BlockUserSchema.updateOne(
                    { _id: data[0]._id },
                    { $set: { "is_active": "0" } }
                )
                if (update_block.modifiedCount > 0) {
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_unblock_user_success_message, null);
                } else {
                    return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
                }
            } else {
                let update_block = await BlockUserSchema.updateOne(
                    { _id: data[0]._id },
                    { $set: { "is_active": "1" } }
                )
                if (update_block.modifiedCount > 0) {
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_block_user_success_message, null);
                } else {
                    return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
                }
            }
        } else {
            let params = {
                blocked_from: user_id,
                blocked_to: block_id
            };
            const newBlockUser = new BlockUserSchema(params);
            newBlockUser.save().then(response => {
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_block_user_success_message, null);
            }).catch((error) => {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
            });
        }

    },

    async create_poll(req, res) {
        let params = {
            user_id: req.user_id,
            question: req.question,
            option_1: req.option_1,
            option_2: req.option_2,
            option_3: (req.option_3 != undefined && req.option_3 != "") ? req.option_3 : "",
            poll_length: (req.poll_length != undefined && req.poll_length != "") ? req.poll_length : 1
        };
        for (let i = 1; i <= 3; i++) {
            for (let j = i + 1; j <= 3; j++) {
                if (req[`option_${i}`] === req[`option_${j}`]) {
                    return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_invalid_poll_option, null);
                }
            }
        }
        const newPoll_schema = new PollSchema(params);
        newPoll_schema.save().then(response => {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_add_poll_vote_message, response);
        }).catch((error) => {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keywords_err_message, null);

        });
    },

    async add_poll_vote(req, res) {
        let user_id = new mongoose.Types.ObjectId(req.user_id);
        let poll_id = new mongoose.Types.ObjectId(req.poll_id);
        let result = await PollVoteSchema.find({ $and: [{ poll_id: poll_id }, { user_id: user_id }, { is_active: "1" }] });
        if (result.length > 0) {
            let params = {};
            for (let i = 1; i <= 3; i++) {
                params[`option_${i}`] = 0;
            }
            if (result[0][`option_${req.vote}`] == 1) {
                params[`option_${req.vote}`] = 0;
            } else {
                params[`option_${req.vote}`] = 1;
            }
            let update_count = await PollVoteSchema.updateOne({ _id: result[0]._id }, params);
            if (update_count.modifiedCount <= 0) {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
            } else {
                let data = await PollVoteSchema.find({ $and: [{ _id: result[0]._id }, { is_active: "1" }] });
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_create_poll_message, data);
            }
        } else {
            let params = {
                poll_id: req.poll_id,
                user_id: req.user_id
            }
            params[`option_${req.vote}`] = 1;
            const newPoll_vote = new PollVoteSchema(params);
            newPoll_vote.save().then(response => {
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_create_poll_message, response);
            }).catch((error) => {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, error);
            });
        }
    },

    async poll_listing(req, res) {
        let user_id = new mongoose.Types.ObjectId(req.user_id);
        const result = await PollSchema.aggregate([
            {
                $match: {
                    $and: [
                        { user_id: user_id },
                        { is_active: "1" },
                        { is_deleted: "0" },
                    ]
                }
            },
            {
                $lookup: {
                    from: "tbl_poll_vote",
                    localField: "_id",
                    foreignField: "poll_id",
                    as: "poll_details"
                }
            },
            {
                $project: {
                    user_id: 1,
                    question: 1,
                    option_1: 1,
                    option_2: 1,
                    option_3: 1,
                    poll_length: 1,
                    my_vote: {
                        $filter: {
                            input: "$poll_details",
                            as: "detail",
                            cond: {
                                $and: [
                                    { $eq: ["$$detail.user_id", user_id] },
                                    { $eq: ["$$detail.is_active", "1"] }
                                ]
                            }
                        }
                    },
                    total_vote: {
                        $size: {
                            $filter: {
                                input: "$poll_details",
                                as: "detail",
                                cond: {
                                    $or: [
                                        { $ne: ["$$detail.option_1", "0"] },
                                        { $ne: ["$$detail.option_2", "0"] },
                                        { $ne: ["$$detail.option_3", "0"] }
                                    ]
                                }
                            }
                        }
                    },
                    option_1_count: {
                        $size: {
                            $filter: {
                                input: "$poll_details",
                                as: "detail",
                                cond: {
                                    $eq: ["$$detail.option_1", "1"]
                                }
                            }
                        }
                    },
                    option_2_count: {
                        $size: {
                            $filter: {
                                input: "$poll_details",
                                as: "detail",
                                cond: {
                                    $eq: ["$$detail.option_2", "1"]
                                }
                            }
                        }
                    },
                    option_3_count: {
                        $size: {
                            $filter: {
                                input: "$poll_details",
                                as: "detail",
                                cond: {
                                    $eq: ["$$detail.option_3", "1"]
                                }
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$my_vote"
            }
        ]);
        result.forEach((element, key) => {
            if (element.total_vote > 0) {
                element.option_1_percentage = (element.option_1_count / element.total_vote) * 100;
                element.option_2_percentage = (element.option_2_count / element.total_vote) * 100;
                element.option_3_percentage = (element.option_3_count / element.total_vote) * 100;
            }
        });
        if (result.length > 0) {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_poll_listing_message, result);
        } else {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
    },

    async people_poll_listing(req, res) {
        let poll_id = new mongoose.Types.ObjectId(req.poll_id);
        let match = [
            { poll_id: poll_id },
            { is_active: "1" },
        ]
        if (req.vote !== undefined) {
            const option = `option_${req.vote}`;
            match.push({ [option]: "1" }); // Add the condition when req.vote is defined
        }
        const result = await PollVoteSchema.aggregate([
            {
                $match: {
                    $and: match
                }
            },
            {
                $lookup: {
                    from: "tbl_user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {
                $project: {
                    user_id: 1,
                    poll_id: 1,
                    option_1: 1,
                    option_2: 1,
                    option_3: 1,
                    user_id: 1,
                    "user_details.first_name": 1,
                    "user_details.last_name": 1,
                    "user_details.user_name": 1
                }
            }
        ]);
        if (result.length > 0) {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_people_poll_listing_message, result);
        } else {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
    },

    async getFollowingCount(user_id) {

        let count = await FollowFollowingSchema.find({ $and: [{ user_id: user_id }, { status: "accepted" }, { is_active: "1" }] });
        let following_count = {
            following_count: count.length
        }
        return following_count;
    },
    async getFollowerCount(follow_id) {

        let count = await FollowFollowingSchema.find({ $and: [{ follow_id: follow_id }, { status: "accepted" }, { is_active: "1" }] });
        let follower_count = {
            follower_count: count.length
        }
        return follower_count;
    }
}

module.exports = homeModel;

