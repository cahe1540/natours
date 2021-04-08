const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email{
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Carlos Herrera <${process.env.NODE_ENV !== 'production' ? process.env.EMAIL_FROM : process.env.SENDGRID_FROM}>`;
  }

  newTransport(){
    if(process.env.NODE_ENV === 'production'){
      //Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }
    
    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "988a108f3a700b",
        pass: "bab6997844b5d9"
      }
    });
  }

  async send(template, subject){
    //1) render html for email based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName : this.firstName,
      url: this.url, 
      subject
    });

    //2) define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.fromString(html)
    }

    //3) create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  sendWelcome(){
    this.send('welcome', 'Welcome to the Natours Family!');
  }

  sendPasswordReset(){
    this.send('passwordReset', 'Your password reset token(valid for only 10 minutes)');
  }
}
