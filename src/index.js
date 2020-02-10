const express = require('express')
require('./db/mongoose') //We only need to execute this file and do not need to use it inside.
const User = require('./models/user') //User name should match with constant defined in user.js
const Task = require('./models/task')

const app = express()
const port = process.env.port || 3000

app.use(express.json()) //allows to parse response to json format.

//Create a new user
app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then( (data) => {
        res.send(data)
    }).catch ((error) => {
        res.status(400).send(error) //We need to explicitly change status in this case otherwise it sends 200, which is success.
                                    //We can chain methods status() and send().to it.
    })
})

//Get all users
app.get('/users', (req, res) => {
    User.find({name: "Test123"}).then((users)=> { //find() is used to get all elements or filter users based on filtering criteria passed 
        res.send(users)
    }).catch((error) => {
        console.log(err)
        res.status(500).send()
    })
})

//Get user by id
app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then( (user) => {

        if(!user){
            res.status(404).send()
        }

        res.send(user)
    }).catch( (err) => {
        res.status(500).send()
    })
})

//Get all tasks
app.get('/tasks', ( req, res) => {

    Task.find().then( (tasks) => {
        res.send(tasks)
    }).catch( (err) => {
        res.status(500).send()
    })
})

//Get task by id
app.get('/tasks/:id', ( req, res) => {

    const _id = req.params.id

    Task.findById(_id).then( (task) => {
        if(!task){
            res.status(404).send()
        }

        res.send(task)
        
    }).catch( (err) => {
        res.status(500).send()
    })
})

//Create a new task
app.post('/tasks', (req,res) => {

  const task = new Task(req.body)

  task.save().then( (data) => {
    res.send(data)
  }).catch( (error) => {
    res.status(400).send(error)
  })
  
})

app.listen(port, ()=> {
    console.log("Listening to port " + port)
})