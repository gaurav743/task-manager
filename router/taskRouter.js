const express = require('express')
const router = new express.Router()
const Task = require('../src/models/task')
const auth = require('../middleware/auth')

//Get all tasks
//tasks?completed=true
//tasks?limit=2&skip=2
//task?sortBy=createdAt:desc
router.get('/tasks', auth , async ( req, res) => {

    try{
        //const tasks = await Task.find({ owner : req.user._id}) //Pass filtering criteria to the find()
        const match = {}
        const sort ={}

        if(req.query.completed){ //Only set to true or false when value is provided in querystring otherwise let it be empty string.
            match.completed = req.query.completed === 'true' //completed is captured as string and not boolean so need to convert it  
                                                             //to boolean.
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        const user = await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), //Need to pass to int as it comes as string.
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate() //User virtual user configuration.
        res.send(user.tasks)
    }catch(error){
        res.status(500).send(error)
    }
})

//Get task by id
router.get('/tasks/:id', auth,  async ( req, res) => {

    try {
        const _id = req.params.id
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id , owner: req.user._id }) //We now prefer findOne as we can pass multiple filtering parameters
                                                                       //inside an object.

        if(!task){
            res.status(404).send()
        }

        res.send(task)
    }catch(error){
        res.status(500).send()
    }
})

//Create a new task
router.post('/tasks', auth, async (req,res) => {

    try{
        //const task = new Task(req.body)

        const task = new Task({ //Using merge operator to add owner propery.
            ...req.body,
            owner: req.user._id
        })

        const taskSaved =  await task.save()
        res.send(taskSaved)
    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }

})

//Update a task.
router.patch('/tasks/:id' , auth,  async (req, res) => {
    try{
        const taskProperties = ['completed', 'description']
        const reqProperties = Object.keys(req.body) //returns array of keys in object.
        const isRequestValid = reqProperties.every( (property) => taskProperties.includes(property))

        if(!isRequestValid){
            res.status(404).send("Request is invalid.")
        }

        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id , owner: req.user._id })//Filter by user.

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body , { new: true, runValidators: true })

        if(!task){
            res.status(404).send()
        }

        reqProperties.forEach( (prop) => {
            task[prop] = req.body[prop]
        })

        task.save()

        res.send(task)

    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }
})

//delete a task
router.delete('/tasks/:id', auth,  async (req, res) => {

    try{
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })// filter by user.
        console.log(task)

        if(!task){
            res.status(404).send()
        }
    
        res.send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = router