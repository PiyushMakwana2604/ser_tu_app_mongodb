const randtoken = require('rand-token').generator();
const common = require("../../../../config/common");
const lang = require("../../../../config/language");
const Codes = require("../../../../config/status_codes");
const UserSchema = require("../../../schema/user_schema");
// const OtpSchema = require('../../../schema/otp_schema');
// const UserCompanySchema = require("../../../schema/user_company_schema");
// const AddressSchema = require("../../../schema/address_schema");
// const UserAgreementTermsSchema = require("../../../schema/user_agreement_terms_schema");
const middleware = require("../../../../middleware/headerValidator");
const template = require("../../../../config/template");
const redis = require("../../../../config/redis");

const userModel = {

    async signup(req, res) {
        const checkEmailUnique = await common.checkUniqueEmail(req);
        if (checkEmailUnique) {
            return await middleware.sendResponse(res, Codes.NOT_FOUND, lang[req.language].rest_keywords_unique_email_error, null)
        }
        const checkMobileUnique = await common.checkUniqueMobile(req);
        if (checkMobileUnique) {
            return await middleware.sendResponse(res, Codes.NOT_FOUND, lang[req.language].rest_keywords_unique_mobilenumber_error, null)
        }
        const encPass = await middleware.encryption(req.password);
        const token = randtoken.generate(64, "0123456789abcdefghijklnmopqrstuvwxyz");
        let user_device = {
            token: token,
            device_type: req.device_type,
            device_token: req.token,
        }
        let user = {
            first_name: req.first_name,
            last_name: req.last_name,
            user_name: req.user_name,
            dob: req.dob,
            mobile: req.mobile,
            email: req.email,
            password: encPass,
            front_id_proof: req.front_id_proof,
            back_id_proof: req.back_id_proof,
            country_code: req.country_code,
            id_prooof_type: (req.id_prooof_type != undefined) ? req.id_prooof_type : "adhar card",
            otp_code: (req.otp_code != undefined) ? req.otp_code : "",
            mobile_verify: (req.mobile_verify != undefined) ? req.mobile_verify : "pending",
            device_info: user_device
        }
        let OTP = Math.floor(1000 + Math.random() * 9000);
        user.otp_code = OTP;
        const newUser = new UserSchema(user);
        console.log(newUser);
        newUser.validate().then(() => {
            newUser.save().then(response => {
                // delete response.password;
                return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_success_message, response);
            }).catch((error) => {
                return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_adduserdata_error_message, error);
            });
        }).catch((error) => {
            return middleware.sendResponse(res, Codes.VALIDATION_ERROR, lang[req.language].rest_keywords_userdata_notvalid_message, error);
        });

    },

    async otp_verification(req, res) {
        const userData = await UserSchema.findOne({ $and: [{ mobile: req.mobile }, { is_active: "1" }, { is_deleted: "0" }] });
        if (!userData) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_userdatanotfound_message, null);
        }
        if (userData.otp_code != req.otp) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_userotpdata_notvalid_message, null);
        }
        let upd_params = {
            otp_code: "",
            mobile_verify: "verified"
        }
        const filter = { mobile: req.mobile };
        const update = { $set: upd_params };
        let update_user = await UserSchema.updateOne(filter, update);
        if (update_user.modifiedCount <= 0) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
        return await middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_otpverified_success_message, null);
    },

    async resend_user_otp(req, res) {
        const userData = await UserSchema.findOne({ $and: [{ mobile: req.mobile }, { is_active: "1" }, { is_deleted: "0" }] });
        if (!userData) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_userdatanotfound_message, null);
        }
        let OTP = Math.floor(1000 + Math.random() * 9000);
        let upd_params = {
            otp_code: OTP
        }
        const filter = { _id: userData._id };
        const update = { $set: upd_params };
        let update_user = await UserSchema.updateOne(filter, update);
        if (update_user.modifiedCount <= 0) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
        // let data = await userModel.userData(userData._id);
        // console.log('aaa', userData);
        return await middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_sendotp_success_message, upd_params);
    },

    async login(req, res) {
        const userData = await UserSchema.findOne({ $and: [{ mobile: req.mobile }, { is_deleted: "0" }] });
        if (!userData) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_userdatanotfound_message, null);
        }
        if (userData.is_active == '0') {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_isactive_error_message, null);
        }
        let password = await middleware.encryption(req.password);
        if (userData.password != password) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_password_notvalid_message, null);
        }
        if (userData.mobile_verify == "pending") {
            let OTP = Math.floor(1000 + Math.random() * 9000);
            let upd_params = {
                otp_code: OTP
            }
            const filter = { _id: userData._id };
            const update = { $set: upd_params };
            let update_user = await UserSchema.updateOne(filter, update);
            if (update_user.modifiedCount <= 0) {
                return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
            }
            return await middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_sendotp_success_message, upd_params);
        }
        const token = randtoken.generate(64, "0123456789abcdefghijklnmopqrstuvwxyz");
        let update_token = await UserSchema.updateOne(
            { _id: userData.id },
            { $set: { "device_info.token": token } }
        )
        if (update_token.modifiedCount <= 0) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
        let data = await userModel.getuserData(userData.id);
        return await middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_login_success_message, data);
    },

    async updatePassword(req, res) {
        const userData = await UserSchema.findOne({ $and: [{ mobile: req.mobile }, { is_deleted: "0" }] });
        if (!userData) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_userdatanotfound_message, null);
        }
        if (userData.is_active == '0') {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_isactive_error_message, null);
        }
        const new_password = await middleware.encryption(req.new_password);
        if (userData.password == new_password) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_same_password_message, null);
        }
        let upd_params = {
            password: new_password
        }
        const filter = { _id: userData._id };
        const update = { $set: upd_params };
        let update_pass = await UserSchema.updateOne(filter, update);
        if (update_pass.modifiedCount <= 0) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
        return await middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_password_change_success_message, null);
    },

    async logout(req, res) {
        let update_token = await UserSchema.updateOne(
            { _id: req.user_id },
            { $set: { "device_info.token": "" } }
        )
        if (update_token.modifiedCount <= 0) {
            return await middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, null);
        }
        return await middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_logout_success_message, null);
    },

    async getuserData(user_id) {
        let userData = await UserSchema.findOne({ _id: user_id });
        return userData;
    }
}

module.exports = userModel;
