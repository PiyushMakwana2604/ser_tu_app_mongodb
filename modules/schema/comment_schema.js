const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        required: false
    },
    comment: {
        type: String,
        required: true
    },
    reply_comment_count: {
        type: Number,
        required: true,
        default: 0
    },
    comment_like_count: {
        type: Number,
        required: false,
        default: 0
    },
    is_active: {
        type: String,
        description: "0 : inActive, 1 : Active",
        default: "1",
        enum: ["0", "1"]
    },
    is_deleted: {
        type: String,
        description: "0 : Not Deleted, 1 : Delete ",
        default: "0",
        enum: ["0", "1"]
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const homeModel = mongoose.model('tbl_post_comment', commentSchema, 'tbl_post_comment');
module.exports = homeModel;