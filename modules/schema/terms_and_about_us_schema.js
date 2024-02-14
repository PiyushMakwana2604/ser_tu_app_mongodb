const mongoose = require('mongoose');
const { Schema } = mongoose;

const TermsAndAboutUsSchema = mongoose.Schema({
    content_type: {
        type: String,
        default: "about us",
        enum: ["terms", "about us"]
    },
    content: {
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

const homeModel = mongoose.model('tbl_terms_and_about_us', TermsAndAboutUsSchema, 'tbl_terms_and_about_us');
module.exports = homeModel;