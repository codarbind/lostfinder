require('dotenv').config();

const nodemailer = require('nodemailer');

const mailsender = (messageParams)=> {
let {to,subject,mailBody,htmlBody,filePath} = messageParams;
// Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    
    host: 'smtp.zoho.com',
    port:587,
    auth: {
      user: 'mailhouse247@zohomail.com',
      pass: process.env.LOSTFINDER_MAIL_PASS
    }
  });

  // Specify what the email will look like
  const mailOpts = {
    from: 'Lostfinder <we@lostfinder.com.ng>', 
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