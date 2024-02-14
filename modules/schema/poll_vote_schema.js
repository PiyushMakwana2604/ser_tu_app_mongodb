const mongoose = require('mongoose');
const { Schema } = mongoose;

const PollVoteSchema = mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    poll_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    option_1: {
        type: String,
        default: "0",
        enum: ["0", "1"]
    },
    option_2: {
        type: String,
        default: "0",
        enum: ["0", "1"]
    },
    option_3: {
        type: String,
        default: "0",
        enum: ["0", "1"]
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

const homeModel = mongoose.model('tbl_poll_vote', PollVoteSchema, 'tbl_poll_vote');
module.exports = homeModel;