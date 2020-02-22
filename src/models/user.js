const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require('../models/task')

const userSchema = mongoose.Schema({ //Create a new model 
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
        unique: true,//adds a key to MongoDB table taht ensures there are no duplicate emails.
        trim: true,
        lowercase: true, //converts all letters to lowerCase
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email address is invalid.")
            }
        }  
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true //Options to schema are passed as second argument.
})

//Get tasks from user
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//Hide user private data
userSchema.methods.toJSON = function(){ //Every time res.send() is called on user toJSON is triggered by default.
    const user = this
    const userObject = user.toObject() //return user object.

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar //delete avatar image buffer data from response.

    return userObject
}

//Generate authorization token for user instance.
userSchema.methods.getAuthorizationToken = async function(){
    const user = this //this referes to instance of a user. This is not required for statics function as they are available over model.

    const jwtToken = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET) //toString() is required because user._id is Object

    //add token to tokens array and save.
    user.tokens =  user.tokens.concat({token: jwtToken})
    await user.save()

    console.log(jwtToken)

    return jwtToken
}

userSchema.statics.findByCredentials = async ( email , password) => {

    const user = await User.findOne({email}) //We first use email to get user details.

    if(!user) {
        throw new Error("Unable to find user!!!")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error("Unable to find user!")
    }

    return user
}

userSchema.pre('save', async function(next){ //canot use arrow function here as this object is not available with arrow function.
    const user = this //next is the next set of middleare that we want to execute.
    
    //console.log("Is password changed" + user.isModified('password'))

    if(user.isModified('password')){
        console
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() //In order for middleware to execute this statement is a must. This means we are done with the execution of our hook. 
           //We need to do this because we are working with asynchronous process and we need to explicitly specify when we are 
           //done.
})

//cascade delete tasks on deletion of user.
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

// const User = mongoose.model( 'User', { //Create a new model 
//     name : {
//         type: String,
//         required: true, //Makes it mandatory,
//         trim: true //Removes trailing and leading empty spaces.
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6,
//         trim: true,
//         validate(value){
//             if(value.includes('password')){
//                 throw new Error('Password cannot contain password.')
//             }
//         }
//     },
//     age: {
//         type: Number
//     },
//     email: {
//         type: String,
//         trim: true,
//         lowercase: true, //converts all letters to lowerCase
//         validate(value) {
//             if(!validator.isEmail(value)){
//                 throw new Error("Email address is invalid.")
//             }
//         }  
//     }
// })

module.exports = User