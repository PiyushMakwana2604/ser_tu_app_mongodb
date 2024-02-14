const settingModel = require("../models/setting_model");
const Codes = require("../../../../config/status_codes");
const middleware = require("../../../../middleware/headerValidator");
const validationRules = require('../setting_validation_rules');

const delete_user = async (req, res) => {
    return settingModel.delete_user(req, res)
}

const change_password = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.ChangePasswordValidation)

    if (valid.status) {
        return settingModel.change_password(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

const faq_list = async (req, res) => {
    return settingModel.faq_list(req, res)
}

const terms_and_about_us = async (req, res) => {
    const request = await middleware.decryption(req);

    const valid = await middleware.checkValidationRules(request, validationRules.TermsAndAboutUsValidation)

    if (valid.status) {
        return settingModel.terms_and_about_us(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null);
    }
}

module.exports = {
    delete_user, change_password, faq_list, terms_and_about_us
}