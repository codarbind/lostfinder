const nodemailer = require('nodemailer');

const mailsender = (toMail,mailSubject,mailBody,filePath)=> {

// Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    
    host: 'smtp.zoho.com',
    port:587,
    auth: {
      user: 'mailhouse247@zohomail.com',
      pass: 'Mother2020z'
    }
  });

  // Specify what the email will look like
  const mailOpts = {
    from: 'Lostfinder <mailhouse247@zohomail.com>', 
    to: toMail,
    subject: mailSubject ,
    text: mailBody,// fields.mailbody,
    attachments: [
          {   // filename and content type is derived from path
                  path: filePath,
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