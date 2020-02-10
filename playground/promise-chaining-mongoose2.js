require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('5e3d87251dbc6d317c9fa435', {} ).then( (task) => {
    console.log(task)
    return Task.countDocuments( {} )
}).then( (count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})