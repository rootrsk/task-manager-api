const express = require('express')
require('./src/database/mongoose')
const Task = require('./src/database/models/task')
const userRouter = require('./src/routers/user')
const taskRouter = require('./src/routers/task')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT 

app.use(bodyParser.json())
app.use(userRouter)
app.use(taskRouter)
app.use(express.json())

app.listen(port,()=>{
    console.log("Server is started at Port "+port)
})

