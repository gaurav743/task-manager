const express = require('express')
require('./db/mongoose') //We only need to execute this file and do not need to use it inside.
//const User = require('./models/user') //User name should match with constant defined in user.js
//const Task = require('./models/task')
const userRouter = require('../router/userRouter')
const taskRouter = require('../router/taskRouter')

const app = express()
const port = process.env.PORT

app.use(express.json()) //allows to parse response to json format.

app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
    console.log("Listening to port " + port)
})


//middleware. Need to call this before all other app.use(), which wnsures this is called before others.
// app.use( (req, res, next) => {
//     res.status(503).send('Website is currently in maintenance mode.')
// })

////Code related to uplading images.
//Uploading files to Node server.
// const multer = require('multer')

// //Specify options
// const upload = multer({
//     dest: 'images', //Specify the location where to upload files.
//     limits: {
//         fileSize: 1000000 //Limits the filesize. This is in bytes. 1 million bytes = 1 MB
//     },
//     fileFilter(req, file , cb){ //file has file details and callback allows us to either throw error or allow/deny file upload.
//         // cb(new Error("This is not a PDF file.")) //Throwing an error.
//         // cb(undefined, true) //First argument is for error. Second argumet allows the request to proceed.
//         // cb(undefined, false) //When we do not want to throw error but also do not want to allow file upload

//         if(!file.originalname.match('\.(doc|docx|pdf)$')){ //Will have to use match to specify regular expression.
//             cb(new Error('The file is not a valid file.'))
//         }

//         cb(undefined, true) //If the extension is PDF allow file upload.
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => { //The second argument is the middleware provided by mullter. We pass key of
//                                                              //the file as argument 'upload'. We need to specify same key from client.
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message})
// })

// const mockMiddleware = (req, res, next) => {
//     throw new Error("Failed at middleware.")
// }

// app.post('/upload', mockMiddleware, (req, res) => { //The second argument is the middleware provided by mullter. We pass key of
//     //the file as argument 'upload'. We need to specify same key from client.
// res.send()
// }, (error, req, res, next) => { //Passing error handling function as last argument.
//     res.status(400).send({ error: error.message })
// })

//Getting all task details from user
// const User = require('../src/models/user')
// const main = async () => {
//     const user = await User.findById('5e494d989424bd2358a6f43a')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

//Getting user Object while getting task object.

// const Task = require('../src/models/task')

// const main = async () =>  {
//     let task = await Task.findById('5e494f28007ad930403a9a3c')
//     await task.populate('owner').execPopulate() //Populates relational user details by owner ID.
//     console.log(task)
// }

// main()


// const user = {
//     name: "Gaurav Thakur",
//     password: "sssddsdsdsd"
// }

// user.toJSON = function() {
//     delete this.password
//     return this
// }

// console.log(JSON.stringify(user))

// const jwt = require('jsonwebtoken')

// const setJWTToken = () => {
//     const jwtToken = jwt.sign({ _id : 'fjfkjdfdkh6787'}, 'verifyThisToken', { expiresIn:  '7 days'}) //We need to provide a unique value in first argument, second argument is used 
//                                                            //to check if someone has tampered with the token.
//     //console.log(jwtToken)

//     const data = jwt.verify(jwtToken, 'verifyThisToken')
//     console.log(data)
// }

// setJWTToken()

// const bcrypt = require('bcryptjs')

// const hashPassword = async () => {
//     const password = "Gaurav743"
//     const hashedPassword = await bcrypt.hash(password, 8) // The second parameter is the number of times hashing is done.    
//     const isPasswordMatching = await bcrypt.compare("Gaurav743", hashedPassword)

//     console.log(isPasswordMatching)
// }

// hashPassword()