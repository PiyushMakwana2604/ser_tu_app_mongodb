const userModel = require("../models/user_model");
const Codes = require("../../../../config/status_codes");
const middleware = require("../../../../middleware/headerValidator");
const validationRules = require('../user_validation_rules');

const signup = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.sigupValidation)

    if (valid.status) {
        return userModel.signup(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const otp_verification = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.otpValidation)

    if (valid.status) {
        return userModel.otp_verification(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const resend_user_otp = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.resendotpValidation)

    if (valid.status) {
        return userModel.resend_user_otp(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const login = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.loginValidation)

    if (valid.status) {
        return userModel.login(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const updatePassword = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.updatePasswordValidation)

    if (valid.status) {
        return userModel.updatePassword(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const logout = async (req, res) => {
    return userModel.logout(req, res)
}


module.exports = {
    signup,
    login,
    otp_verification,
    resend_user_otp,
    logout,
    updatePassword
}