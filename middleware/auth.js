const jwt = require('jsonwebtoken')
const User = require('../src/models/user')

const auth = async (req, res, next) => {
    try{
        const authHeader = req.header('Authorization') //This will be passed as header from request with Bearer + token as value.
        const token = authHeader.replace('Bearer ', '') //Remove Bearer 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ _id: decodedToken._id , 'tokens.token': token}) //find the user for which _id matches as returned by token and token is also
                                                                         //part of tokens array.

        if(!user){
            throw new Error()
        }

        req.token = token 
        req.user = user //Instead of filtering user again in route set it here and pass it on.

        next()
    }catch(error){
        res.status(401).send(error)
    }
}

module.exports = auth