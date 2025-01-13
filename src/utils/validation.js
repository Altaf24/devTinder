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

module.exports = {
    validateSignUpData
};
    