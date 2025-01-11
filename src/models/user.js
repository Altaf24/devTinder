const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
       
    },
    lastName: {
        type: String,
       
        
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
        
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)) {
                throw new Error('Password not strong enough');
            }
        }

       
    },
    gender: {
        type: String,
        validate(value) {
            if(!['male', 'female', 'others'].includes(value)) {
                throw new Error('Invalid gender');
            }
        }
        
    },
    age: {
        type: Number,
        min: 18,
        max: 60,
        
    },
    photoUrl: {
        type: String,

    },
    about: {
        type: String,
        default: "Hey there! I am using DevTinder",

    },
    skills: {
        type: [String],
        minlength:10,
    },
    
},{
    timestamps: true,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;