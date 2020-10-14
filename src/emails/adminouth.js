const sgmail = require('@sendgrid/mail')
const sgApiKey = process.env.SENDGRID_API_KEY

sgmail.setApiKey(sgApiKey)

sgmail.send({
    to : process.env.USER_EMAIL,
    from :process.env.ADMIN_EMAIL,
    subject : 'This is for testing',
    text : 'This is working '
})

const sendWelcomeMail = (email,name)=>{
    sgmail.send({
        to : process.env.USER_EMAIL,
        from : process.env.ADMIN_EMAIL,
        subject : 'Welcome message',
        text : `Welcome ${name} to the task manager app.`

    })
}

const sendCancelationMail = (email,name)=>{
    sgmail.send({
        to : process.env.USER_EMAIL,
        from : process.env.ADMIN_EMAIL,
        subject : 'Cancelation of Your account.',
        text : 'Your account have been removed from Database you not longer member of this site.'
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancelationMail
}
