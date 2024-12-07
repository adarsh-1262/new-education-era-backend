const nodemailer = require('nodemailer');


async function sendEmail(recipientEmail, message) {
  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL, 
      to: recipientEmail, 
      subject: 'Confirmation of Expert Booking', 
      text: message, 
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, message: 'Failed to send email', error };
  }
}

module.exports = sendEmail;
