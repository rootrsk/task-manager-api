const User = require('../database/models/user')
const auth = require('../middleware/auth')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const sendMail = require('../emails/account')
router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
})
router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try{
        const token =await user.generateAuthToken()
        await user.save()
        sendMail.sendWelcomeMail(user.email,user.name)
        res.status(201).send({user,token})

    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        await req.user.save()
        res.send()
    } catch(e){
        res.status(505).send(e)
    }
})
router.post('/users/logouts',auth,async(req,res)=>{
    try{
        
        console.log(req.user.tokens)
        req.user.tokens = []
        await req.user.save()
        console.log(req.user.tokens)
        res.send(req.user)
    }catch(e){
        res.send('fuck u '+ e)
    }
})
router.patch('/users/me',auth,async(req,res)=>{ 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isValidOperation = updates.every((fields)=> allowedUpdates.includes(fields))
    if (!isValidOperation) return res.status(400).send()
    try{
        const user = await User.findById(req.user._id)
        // const user = await User.findByIdAndUpdate(req.params.id, req.body,{ new : true, runValidators: true })
        updates.forEach((update)=>user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch(e){ 
        res.status(505).send(e)
    }
})
router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(505).send(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        await req.user.remove()
        sendMail.sendCancelationMail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(505).send(e)
    }
})
const upload = multer({
    limits:{
        fileSize : 100000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('Select a jpg,jpeg or png file'))
        return cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width : 250,height: 250}).png().toBuffer()
    req.user.avatar = buffer,
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(404).send({error : error.message})
})

router.delete('/users/me/avatar',async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findOne({_id : req.params.id})  
        if(!user || !user.avatar)  throw new Error()
        res.set('Content-Type','image/jpg')
        res.send(user.avatar) 
    }catch(e){
        res.status(505).send({error : e.message})
    }
})

module.exports = router