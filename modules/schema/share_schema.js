const mongoose = require('mongoose');
const { Schema } = mongoose;

const Postshareschema = mongoose.Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sender_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    receiver_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    is_active: {
        type: String,
        description: "0 : inActive, 1 : Active",
        default: "1",
        enum: ["0", "1"]
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const homeModel = mongoose.model('tbl_post_share', Postshareschema, 'tbl_post_share');
module.exports = homeModel;