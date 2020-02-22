const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMailOnRegister = (email, name) => {
    sgMail.send({
        from: email,
        to: email,
        subject: 'Welcome to stackmetric',
        text: `Hi ${name} . Welcome to stackmetric. Learn thy stack!!!!!` //Using ES6 string interpolation using backticks. We can include 
                                                                          //variables as $ {variableName }
    })
}

const sendMailOnDelete = (email, name) => {
    sgMail.send({
        from: email,
        to: email,
        subject: 'Thanks for being on stackmetric',
        text: `Hi ${name} . Thanks for being on stackmetric. Do let us know if we can improve in any way`
    })
}


module.exports = {
    sendMailOnRegister,
    sendMailOnDelete
}