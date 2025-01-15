const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName ) {
       throw new Error('Please enter first name and last name');
    }
    else if(!validator.isEmail(email)) {
        throw new Error('Invalid email');
    }else if(!validator.isStrongPassword(password)) {
        throw new Error('Password not strong enough,Please enter strong password');
    }

};

const validateEditProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', "email", 'age', "about", "skills", "gender"];
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    
    if (!isEditAllowed) {
        return false;
    }
    return true;
}

module.exports = {
    validateSignUpData,validateEditProfileData
};
    