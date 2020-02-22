require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('5e3e4e6e2b3ef8415008dc5d', { age: 31 }).then( (user) => {
//     console.log(user)
//     return User.countDocuments({ age: 31 })
// }).then( (count) => {
//     console.log("Total users of age 31 are " + count )
// }).catch( (error) => {
//     console.log(error)
// })


//Code with async await.

const updateByIdAndCount = async (id , age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateByIdAndCount('5e3e4e6e2b3ef8415008dc5d', 32).then( (count) => {
    console.log(count)
}).catch( (error) => {
    console.log(error)
})
