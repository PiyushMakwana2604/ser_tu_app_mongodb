const mongoose = require('mongoose');
const { Schema } = mongoose;

const Blockuserschema = mongoose.Schema({
    blocked_from: {
        type: Schema.Types.ObjectId,
        required: true
    },
    blocked_to: {
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

const homeModel = mongoose.model('tbl_block_user', Blockuserschema, 'tbl_block_user');
module.exports = homeModel;