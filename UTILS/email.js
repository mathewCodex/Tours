// const nodeMailer = require('nodemailer');
// const pug = require('pug')
// // const htmlToText = require('html-to-text')
// const { htmlToText } = require('html-to-text')
// //new EMail(user,url).someWelcome
//  module.exports = class Email {
//     constructor(user,url){
//  this.to = user.email;
//  this.firstName = user.name.split(' ')[0];
//  this.url = url;
//  this.from = `mathewCodex <{process.env.EMAIL_FROM}>`;
//     }
//     //creating method for email transport
//     newTransport(){
// if(process.env.NODE_ENV === 'production'){
//     //sendgrid
//     return 1;
// }
//  return nodeMailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port:process.env.EMAIL_PORT,


//         auth:{
//             user:process.env.EMAIL_USERNAME,
//             pass:process.env.EMAIL_PASSWORD
//         }
//         //activate in gmail "less secure app"
//     })
//     }
//     //creating the send method
//    async  send(template,subject){
//         //Send the actual email
//         //1, render the HTML for email based on pug template
//          const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
//          firstName: this.firstName, 
//          url: this.url,
//          subject
//          }
//          )
//         //2,define the email options
//           const mailOptions = {
//             /*error on mail spelling*/
//             from: this.from,
//             to:this.to,
//             subject,
//             html,
//             text: htmlToText(html)
//             //
//           };
//     //3, create a transport and send email

// //  await this.newTransport().sendMail(mailOptions)
//  await this.newTransport().sendMail(mailOptions);
//     }
//     async sendWelcome(){
//       await  this.send('Welcome', 'Welcome to the natours family!')
//     }
//  }

// // const pug =  require('pug');
// // const htmlToText = require('html-to-text')
// // const sendEmail = async  options => {
// //     //three steps to use node mailer

// //         //activate in gmail "less secure app"
    
// //     //2,Define the email options
  
// //     //3,Actually send the email
  
// // }

        
const nodemailer = require("nodemailer");
const pug = require("pug");
const {htmlToText} = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `mathewCodex <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") 
    {
      //sendgrid
      return nodemailer.createTransport({
        service: 'sendGrid',
         auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
      })
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};