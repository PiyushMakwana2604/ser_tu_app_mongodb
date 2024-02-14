const mongoose = require('mongoose');
const { Schema } = mongoose;

const FollowFollowingschema = mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    follow_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["accepted", "pending"]
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

const homeModel = mongoose.model('tbl_follow_following', FollowFollowingschema, 'tbl_follow_following');
module.exports = homeModel;