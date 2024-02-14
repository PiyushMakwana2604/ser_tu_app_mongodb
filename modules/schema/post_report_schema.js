const mongoose = require('mongoose');
const { Schema } = mongoose;

const Postreportschema = mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    report_type: {
        type: String,
        enum: ["spam", "inappropriate"]
    },
    description: {
        type: String,
        // default: ""
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

const homeModel = mongoose.model('tbl_post_report', Postreportschema, 'tbl_post_report');
module.exports = homeModel;