const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: {
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        require :true,
        ref:'User'
    }
},{
    timestamps : true
})

taskSchema.pre('save',async function(next){
    console.log('Before saving')
    next()
})

const Task = mongoose.model('Task',taskSchema)
module.exports = Task