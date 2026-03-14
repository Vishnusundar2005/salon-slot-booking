const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a booking confirmation email.
 * @param {object} user - User object
 * @param {object} booking - Booking object
 * @param {object} service - Service object
 */
const sendBookingConfirmation = async (user, booking, service) => {
  try {
    const mailOptions = {
      from: `"Slotify Salon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '✨ Booking Confirmed - Slotify Salon',
      text: `Hi ${user.name},\n\nYour appointment for ${service.name} is confirmed!\n\n📅 Date: ${booking.date}\n⏰ Time: ${booking.slotTime}\n💰 Price: ₹${service.price}\n\nSee you soon!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Booking Confirmed!</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your appointment for <strong>${service.name}</strong> has been successfully booked.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p>📅 <strong>Date:</strong> ${booking.date}</p>
          <p>⏰ <strong>Time:</strong> ${booking.slotTime}</p>
          <p>💰 <strong>Price:</strong> ₹${service.price}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 0.875rem;">If you need to reschedule or cancel, please do so from your dashboard.</p>
          <p>See you soon! 👋<br/><strong>Slotify Salon Team</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 [Email] Confirmation sent to ${user.email} (ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`❌ [Email] Error sending confirmation: ${error.message}`);
    // Non-blocking error
  }
};

/**
 * Sends an appointment reminder email.
 */
const sendReminder = async (user, booking, service) => {
  try {
    const mailOptions = {
      from: `"Slotify Salon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🚨 HURRY UP! Your slot is waiting - Slotify Salon',
      text: `Hi ${user.name},\n\nHurry up, your slot is waiting! Your appointment for ${service.name} starts in just 10 minutes.\n\n⏰ Time: ${booking.slotTime}\n\nPlease arrive quickly! See you soon!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 2px solid #ef4444; border-radius: 12px; background-color: #fffafb;">
          <h2 style="color: #ef4444; font-size: 24px; text-transform: uppercase;">🚨 HURRY UP!</h2>
          <p style="font-size: 18px;">Hi <strong>${user.name}</strong>,</p>
          <p style="font-size: 16px; color: #1f2937;">Your slot is waiting! Your appointment for <strong>${service.name}</strong> is starting in about <strong>10 minutes</strong>!</p>
          <div style="background-color: #ef4444; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 20px; font-weight: bold;">⏰ Time: ${booking.slotTime}</span>
          </div>
          <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 20px 0;" />
          <p style="font-weight: bold; color: #ef4444;">Please arrive as soon as possible. We are waiting for you!</p>
          <p>Best,<br/><strong>Slotify Salon Team</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 [Email] Reminder sent to ${user.email}`);
    return info;
  } catch (error) {
    console.error(`❌ [Email] Error sending reminder: ${error.message}`);
  }
};

/**
 * Sends a slot expired notification email.
 */
const sendSlotExpired = async (user, booking, service) => {
  try {
    const mailOptions = {
      from: `"Slotify Salon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '⚠️ Appointment Expired - Slotify Salon',
      text: `Hi ${user.name},\n\nYour appointment for ${service.name} at ${booking.slotTime} on ${booking.date} has been marked as expired as the time has passed.\n\nBest, Slotify Salon Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ef4444;">Appointment Expired</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your appointment for <strong>${service.name}</strong> at <strong>${booking.slotTime}</strong> on <strong>${booking.date}</strong> has been marked as <strong>Expired</strong> because the time has passed.</p>
          <p>If you still wish to book, please visit our booking page to select a new slot.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p>Best,<br/><strong>Slotify Salon Team</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 [Email] Expiration notice sent to ${user.email}`);
    return info;
  } catch (error) {
    console.error(`❌ [Email] Error sending expiration notice: ${error.message}`);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendReminder,
  sendSlotExpired,
};
