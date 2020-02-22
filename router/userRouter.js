const express = require('express')
const router = new express.Router()
const User = require('../src/models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendMailOnRegister, sendMailOnDelete } = require('../src/emails/account')

//Create a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        const userSaved  = await user.save()

        //Send email
        sendMailOnRegister(userSaved.email, userSaved.name)

        //Generate authorized token for user save it in DB and send it back.
        const token = await user.getAuthorizationToken()

        res.send({ userSaved, token })
    }catch(error){
        res.status(400).send(error)
    }
 })

//Get user profile
router.get('/users/me', auth , async (req, res) => { //We have added auth middleware a second argument

    try{
        res.send(req.user) //req.user is coming from middleware.
    }catch(error){
        res.status(500).send()
    }
})

// //Get user by id
// router.get('/users/:id', async (req, res) => {

//     try{
//         const _id = req.params.id
//         const user = await User.findById(_id)

//         if(!user){
//             res.status(404).send()
//         }

//         res.send(user)

//     }catch(error){
//         console.log(error)
//         res.status(500).send()
//     }
// })

//Update a user
router.patch('/users/me', auth ,  async (req, res) => {
    try{
        console.log("Starting execution")
        const userProperties = ['name', 'age', 'password', 'email']
        const updateProps = Object.keys(req.body) //Returns array of key properties in object.

        const isValidRequest = updateProps.every( (updateProp) => userProperties.includes(updateProp))

        if(!isValidRequest){
            res.status(404).send({ error: "The request is invalid."})
        }

        //Modifying manually to support mongoose middleware.
        //const user = await User.findById(req.params.id)

        const user = req.user //Coming from auth middleware.

        updateProps.forEach( (prop) => {
            user[prop] = req.body[prop]
        })
        
        user.save()
        
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) //new: true return the updated record.
        //runValidators ensures mongoose validations are checked.
        
        console.log(user)

        if(!user){
            res.status(404).send()
        }

        res.send(user)
        
    }catch(error){
        res.send(400, error)
    }
})

//delete a user.
router.delete('/users/me', auth, async (req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.params.id)

        // console.log(user)

        // if(!task){
        //     res.status(404).send()
        // }
        const user = req.user
        await user.remove()

        //Send email 
        sendMailOnDelete(user.email, user.name)

        res.send(user)

    }catch(error){
        res.status(400).send(error)
    }
})

//user login
router.post('/users/login', async (req, res) => {

    try{
        const user = await User.findByCredentials(req.body.email, req.body.password) //This function will be available from user schema.
        const token = await user.getAuthorizationToken(); //getAuthorizationToken is specific to user instance as different token will be issued
                                                          // to each user.
        res.send({user , token }) //return back token to the end user.
    }catch(error){
        res.status(400).send(error)
    }
})

//user logout
router.post('/users/logout', auth , async (req, res) => {
    try{
        const user = req.user
        // user.tokens = user.tokens.filter( (token) => {
        //     return token.token != req.token
        // })

        user.tokens = []
        
        await user.save()

        res.send()

    }catch(error){
        res.status(500).send(error)
    }
})

//Adding avatar image for user

const avatar = multer({
    // dest: 'avatar', //Removing this will automatically return image as a buffer in router.
    limits: {
        fileSize: 1000000 //1MB
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match('\.(jpeg|jpg|png)$')){ //Files with extensions png/jpg/jpeg
            cb(new Error('Upload image with correct format.'))
        } 

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req,res)=> {
    const buffer = await sharp(req.file.buffer).resize({ height: 250 , width: 250 }).png().toBuffer()
    req.user.avatar = buffer
    //req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, ( error, req, res, next ) => {
    res.status(400).send({ error: error.message })
})

//Delete avatar
router.delete('/users/me/avatar', auth, async(req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//get avatar image
router.get('/users/:id/avatar', async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        
        if(!user || !user.avatar){
            throw new Error("Image is not available.")
        }

        res.set('Content-Type','image/jpg') //If we do not specify express implicitly sets it to application/json. 
                                            //Since, we need to serve an image we need to explicitly set it to image/jpg
        res.send(user.avatar)

    }catch(error){
        res.status(404).send(error)
    }
})

module.exports = router