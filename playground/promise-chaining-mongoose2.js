require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5e3d87251dbc6d317c9fa435', {} ).then( (task) => {
//     console.log(task)
//     return Task.countDocuments( {} )
// }).then( (count) => {
//     console.log(count)
// }).catch((error) => {
//     console.log(error)
// })

//async await

const deleteByIdAndCount = async (id) => {
    const task = await Task.findByIdAndDelete('5e3faa2dcec29423b074633d')
    const count = await Task.countDocuments()
    return count
}

deleteByIdAndCount('5e3faa2dcec29423b074633d').then( (count) => {
    console.log(count)
}).catch( (error) => {
    console.log(error)
})