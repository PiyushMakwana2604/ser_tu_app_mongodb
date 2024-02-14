const mongoose = require('mongoose');
const { Schema } = mongoose;

const PollSchema = mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    option_1: {
        type: String,
        required: true,
    },
    option_2: {
        type: String,
        required: true,
    },
    option_3: {
        type: String
    },
    poll_length: {
        type: Number,
        default: 1
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

const homeModel = mongoose.model('tbl_poll', PollSchema, 'tbl_poll');
module.exports = homeModel;