require('../src/db/mongoose')
const User = require('../src/models/user')

User.findByIdAndUpdate('5e3e4e6e2b3ef8415008dc5d', { age: 31 }).then( (user) => {
    console.log(user)
    return User.countDocuments({ age: 31 })
}).then( (count) => {
    console.log("Total users of age 31 are " + count )
}).catch( (error) => {
    console.log(error)
})
