const express = require('express')
const Task = require('../database/models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    if(req.query.completed === 'true') {
        match.completed = 'true'
    } else if(req.query.completed === 'false') match.completed = 'false'
    try{
        // const task = await Task.find({owner : req.user._id})
        task = await req.user.populate({
            path : 'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort:{
                    completed : 1
                }
            }
        }).execPopulate()
        res.status(201).send(req.user.tasks)
    } catch(e){
        res.status(400).send(e)
    }
})
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner : req.owner._id})
        // console.log(task)
        if(!task){
            return res.status(404).send()
        }
        res.status(201).send(task)
    } catch(e){
        res.status(505).send(e)
    }

})
//Creating new task 
router.post('/tasks',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((item) => allowedUpdates.includes(item))
    if(!isValidOperation) return res.status(400).send()
    try {
        const task = await Task.findOne({_id : req.params.id,owner : req.user._id})
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
        if(!task) return res.status(400).send()
        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(505).send(e)
    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOne({_id :req.params.id,owner : req.user._id})
        if(!task) return res.status(400).send('No such task found')
        res.send('deleted sucessfully'+task)
    }catch(e){
        res.status(505).send(e)
    }
})
module.exports = router