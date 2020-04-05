const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient 
const connUrl = 'mongodb://127.0.0.1:27017'
const dbName ='task-manager'

MongoClient.connect(connUrl,{useNewUrlParser:true},(error,client)=>{
    if(error) return console.log('Error in connecting to database')
    console.log('connected successfully')
    const db = client.db(dbName)
    // db.collection('users').insertMany([
    //     {
    //     Name:'mayank bhushan',
    //     age :21
    //     },{
    //         Name:'Uday kumar',
    //         age:25,
    //         genrer:'male'
    //     }
    // ])
    db.collection('users').findOne({age : 22},(error,users)=>{
        console.log(users)
    })
    db.collection('users').find({age :21}).toArray((error,users)=>{
        console.log(users)
    })
})

