const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const Task = require('./task')

//userSchema is used to define object with it's requied value and datatype
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },      
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('This is not a valid email.')
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length<6) throw new Error ('Password must contain atleast 6 character!')
            else if(value.includes('password')) throw new Error ('Password connot conatin "password"')
        }
    },
    age:{
        type:Number,
        default:0,
        trim:true,
        validate(value){
            if(value<0) throw new Error ('Age cannot set as negative ')
        }
    },
    tokens:[{
        token:{
            type: String,
            require: true
        }
    }],
    avatar:{
        type : Buffer
    }
},{
    timestamps:true
})

//toJson is automatacally called function  on user data or to json file which is fetched
userSchema.methods.toJSON =  function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
//userSchema.methods is  called on user of User model -> user = User.findOne({...})-> user.generateAuthToken()
userSchema.methods.generateAuthToken = async function(){
    const user = this 
    const token =  jwt.sign({_id : user._id.toString()},'')
    user.tokens = user.tokens.concat({token : token })
    await user.save()
    return token

}
//userSchema.statics.findByCredentials is function which can be  User model -> User.findByCredential(.......)
userSchema.statics.findByCredentials= async(email,password)=>{
    const user = await  User.findOne({email})
    if(!user) throw new Error('Email or  password is incorrect')
    user.de
    const isMatch =  await bcrypt.compare(password,user.password)
    if(!isMatch) throw new Error('Email or password is incorrect')
    return user
}
//password bycrypt before saving .Either password is set or modified
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')) {
         user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this 
    await Task.deleteMany({owner : user._id})
    next()
})
//virtual model for fetching task of an user
//In Task database match id of User model to owner of Task model
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField : 'owner'

})

//mongoose.model is used to define model for database 
const User = mongoose.model('User',userSchema)
module.exports = User