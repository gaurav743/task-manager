const mongoose = require('mongoose')

mongoose.connect( process.env.MONGODB_URL, { //task-manager-api is the database we will create
    useNewUrlParser : true , 
    useCreateIndex: true
})

// const Task = mongoose.model("task", {
//     description: {
//         required: true,
//         type: String,
//         trim: true
//     }, 
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const task = new Task({
//     description: "Learn Angular"
// })

// task.save(task).then((response) => {
//     console.log(response)
// }).catch ( (error) => {
//     console.log(error)
// })


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

// const me = new User({
//     name: "Test345",
//     age: 43,
//     email: "gaurav_tk@yahoo.co.in",
//     password: "ABCpassword"
// })

// me.save().then( (data) => {
//     console.log(data) //The output return __v which is the version number of the document.
// }).catch((error) => {
//     console.log(error)
// })