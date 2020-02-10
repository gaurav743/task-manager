const validator = require('validator')
const mongoose = require('mongoose')

const User = mongoose.model( 'User', { //Create a new model 
    name : {
        type: String,
        required: true, //Makes it mandatory,
        trim: true //Removes trailing and leading empty spaces.
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password cannot contain password.')
            }
        }
    },
    age: {
        type: Number
    },
    email: {
        type: String,
        trim: true,
        lowercase: true, //converts all letters to lowerCase
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email address is invalid.")
            }
        }  
    }
})

module.exports = User