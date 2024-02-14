const checkValidatorRules = {

    ChangePasswordValidation: {
        old_password: "required",
        new_password: "required"
    },

    TermsAndAboutUsValidation: {
        content_type: "required",
    }
}

module.exports = checkValidatorRules;
