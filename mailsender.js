require('dotenv').config();

const nodemailer = require('nodemailer');

const mailsender = (messageParams)=> {
let {to,subject,mailBody,htmlBody,filePath} = messageParams;
  return false //remove later
// Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    
    //service: 'gmail',
    host: 'smtp.mailgun.org',
    port:587,
  
    auth: {
      user: process.env.LOSTFINDER_MAIL,
      pass: process.env.LOSTFINDER_MAIL_PASS
    }
  });

  // Specify what the email will look like
  const mailOpts = {
    from: 'Kikiayo from Lostfinder <kikiayo@lostfinder.com.ng>', 
    to: to,
    subject: subject ,
    text: mailBody,// fields.mailbody,
    html:htmlBody,
    attachments: [
          {   // filename and content type is derived from path
                  path: "./images/lfgad.png",
              },
    ]

  };



// Attempt to send the email

smtpTrans.sendMail(mailOpts, (error, res) => {

    if (error) {
          
      console.log('error encountered' + error ); 
        }
    else { 

      console.log('sent email success',res);
   
     
    }



  });}

exports.mailsender = mailsender;
