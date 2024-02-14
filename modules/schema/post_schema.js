const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    comment_count: {
        type: Number,
        required: true,
        default: 0
    },
    like_count: {
        type: Number,
        required: true
    },
    share_count: {
        type: Number,
        required: true
    },
    save_count: {
        type: Number,
        required: true
    },
    tag_count: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hastag: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
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

const homeModel = mongoose.model('tbl_post', postSchema, 'tbl_post');
module.exports = homeModel;