const randtoken = require('rand-token').generator();
const common = require("../../../../config/common");
const lang = require("../../../../config/language");
const Codes = require("../../../../config/status_codes");
const UserSchema = require("../../../schema/user_schema");
const FaqSchema = require("../../../schema/faq_schema");
const TermsandAboutUsSchema = require("../../../schema/terms_and_about_us_schema");
const middleware = require("../../../../middleware/headerValidator");
const template = require("../../../../config/template");
const redis = require("../../../../config/redis");
const mongoose = require('mongoose');

const settingModel = {
    async delete_user(req, res) {
        let update_user = await UserSchema.updateOne(
            { _id: req.user_id },
            { $set: { "is_deleted": "1" } }
        )
        if (update_user.modifiedCount > 0) {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_delete_user_success_message, null);
        } else {
            return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
    },
    async change_password(req, res) {
        const userData = await UserSchema.findOne({ $and: [{ _id: req.user_id }, { is_active: "1" }, { is_deleted: "0" }] });
        if (userData) {
            const oldPass = await middleware.encryption(req.old_password);
            if (userData.password == oldPass) {
                const newPass = await middleware.encryption(req.new_password);
                if (userData.password == newPass) {
                    return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_same_pass_err_message, null);
                }
                let update_user = await UserSchema.updateOne(
                    { _id: req.user_id },
                    { $set: { "password": newPass } }
                )
                if (update_user.modifiedCount > 0) {
                    return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_change_pass_success_message, null);
                } else {
                    return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
                }
            } else {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_wrong_pass_message, null);
            }
        } else {
            return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
    },
    async faq_list(req, res) {
        let data = await FaqSchema.find({ is_active: "1" });
        if (data) {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_faq_success_message, data);
        } else {
            return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
    },
    async terms_and_about_us(req, res) {
        const data = await TermsandAboutUsSchema.find({ $and: [{ content_type: req.content_type }, { is_active: "1" }] });

        console.log(data);
        if (data.length > 0) {
            return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_terms_list_success_message, data);
        } else {
            return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_no_data_message, null);
        }
    }
}

module.exports = settingModel;
