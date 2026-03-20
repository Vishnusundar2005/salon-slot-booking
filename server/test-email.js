require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function test() {
  console.log('--- Email Test Diagnostic ---');
  console.log('User:', process.env.EMAIL_USER);
  console.log('Pass:', process.env.EMAIL_PASS ? '********' : 'NOT SET');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Error: EMAIL_USER or EMAIL_PASS missing in .env');
    return;
  }

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Slotify Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Test Email from Slotify Diagnostic',
      text: 'This is a test email to verify SMTP settings.',
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email Test Failed!');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    if (error.message.includes('Invalid login')) {
      console.error('Tip: Check if your Google App Password is correct or if 2FA is enabled.');
    }
  }
}

test();
