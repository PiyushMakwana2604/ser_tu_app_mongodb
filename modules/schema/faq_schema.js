const mongoose = require('mongoose');
const { Schema } = mongoose;

const faqSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true,
        default: 0
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

const homeModel = mongoose.model('tbl_faq', faqSchema, 'tbl_faq');
module.exports = homeModel;