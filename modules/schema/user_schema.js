const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  profile_image: {
    type: String,
    required: true,
    default: "default.png"
  },
  cover_image: {
    type: String,
    required: true,
    default: "default_cover.png"
  },
  about: {
    type: String,
    required: false
  },
  dob: {
    type: Date,
    required: true
  },
  country_code: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  front_id_proof: {
    type: String,
    required: false,
    default: ""
  },
  back_id_proof: {
    type: String,
    required: false,
    default: ""
  },
  id_prooof_type: {
    type: String,
    enum: ["adhar card", "passport", "licence"]
  },
  otp_code: {
    type: String,
    required: false,
    default: ""
  },
  mobile_verify: {
    type: String,
    enum: ["pending", "verified"],
    default: "pending"
  },
  device_info: {
    type: JSON,
    required: false,
    default: null
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

const userMondel = mongoose.model('tbl_user', userSchema, 'tbl_user');
module.exports = userMondel;