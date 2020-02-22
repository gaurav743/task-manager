const mongoose = require('mongoose')

const taskSchema = mongoose.Schema( {
    description: {
        required: true,
        type: String,
        trim: true
    }, 
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        reuired: true,
        ref: 'User' //Will retreive User object based on owner ID from DB.
    }
}, {
    timestamps: true //Options to schema are passed as second argument.
})

const Task = mongoose.model("Task", taskSchema)

// const Task = mongoose.model("task", {
//     description: {
//         required: true,
//         type: String,
//         trim: true
//     }, 
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         reuired: true,
//         ref: 'User' //Will retreive User object based on owner ID from DB.
//     }
// })

module.exports = Task

