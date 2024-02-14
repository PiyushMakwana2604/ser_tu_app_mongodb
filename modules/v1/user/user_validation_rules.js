const checkValidatorRules = {

    sigupValidation: {
        first_name: "required",
        last_name: "required",
        user_name: "required",
        dob: "required",
        mobile: "required|digits_between:10,14",
        email: "required|email",
        password: "required",
        country_code: "required",
        front_id_proof: "required",
        back_id_proof: "required",
        id_prooof_type: "required|in:adhar card,passport,licence",
        token: "required",
        device_type: "required|in:A,I"
    },

    otpValidation: {
        mobile: "required",
        otp: "required"
    },

    resendotpValidation: {
        mobile: "required"
    },

    loginValidation: {
        mobile: "required",
        password: "required"
    },

    updatePasswordValidation: {
        mobile: "required",
        new_password: "required"
    }
}

module.exports = checkValidatorRules;

