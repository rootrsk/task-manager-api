const sgmail = require('@sendgrid/mail')
const sgApiKey = process.env.SENDGRID_API_KEY

sgmail.setApiKey(sgApiKey)

sgmail.send({
    to : 'ravishankar7050@gmail.com',
    from :'rootrsk@gmail.com',
    subject : 'This is for testing',
    text : 'This is working '
})

const sendWelcomeMail = (email,name)=>{
    sgmail.send({
        to : email,
        from : 'rootrsk@gmail.com',
        subject : 'Welcome message',
        text : `Welcome ${name} to the task manager app.`

    })
}

const sendCancelationMail = (email,name)=>{
    sgmail.send({
        to : email,
        from : 'rootrsk@gmail.com',
        subject : 'Cancelation of Your account.',
        text : 'Your account have been removed from Database you not longer member of this site.'
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancelationMail
}