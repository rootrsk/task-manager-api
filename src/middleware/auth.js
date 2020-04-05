const User = require('../database/models/user')
const jwt = require('jsonwebtoken')
//in auth we are passing three aurg. next() function is call to end the function 
// jwt.verify takes two aurgement token and secret code  and return the id

const auth  = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,JWT_SECRET)
        const user = await User.findOne({_id :decode._id,'tokens.token' : token})
        if(!user) throw new Error('No user found')
        req.user = user 
        req.token = token
        req.tokens = req.tokens
        next() 
    } catch(e) {
        res.status(505).send({error : 'Please login'})
    }
}
module.exports = auth