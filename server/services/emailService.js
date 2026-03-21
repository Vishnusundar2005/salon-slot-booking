const { Resend } = require('resend');

// Initialize Resend client only if API key exists to prevent crash on startup
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends a booking confirmation email to the customer.
 */
const sendBookingConfirmation = async (user, booking, service) => {
  try {
    if (!resend) {
      console.warn('⚠️ [Email] Resend client not initialized. Check RESEND_API_KEY.');
      return;
    }

    console.log(`📧 [Email] Sending confirmation via Resend to: ${user.email}`);

    const { data, error } = await resend.emails.send({
      from: 'Slotify Salon <onboarding@resend.dev>',
      to: user.email,
      subject: '✨ Booking Confirmed - Slotify Salon',
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
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`✅ [Email] Confirmation sent successfully (ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error(`❌ [Email] Error sending confirmation: ${error.message}`);
    if (error.message.includes('onboarding')) {
      console.warn('💡 [Tip] If using onboarding@resend.dev, you can only send to your own registered email address.');
    }
  }
};

/**
 * Sends an alert to the admin about a new booking.
 */
const sendAdminAlert = async (user, booking, service) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('⚠️ [Email] ADMIN_EMAIL not configured. Skipping admin alert.');
      return;
    }

    if (!resend) {
      console.warn('⚠️ [Email] Resend client not initialized. Skipping admin alert.');
      return;
    }

    console.log(`📧 [Email] Sending admin alert to: ${adminEmail}`);

    const { data, error } = await resend.emails.send({
      from: 'Slotify Alerts <onboarding@resend.dev>',
      to: adminEmail,
      subject: `🔔 New Booking: ${service.name} - ${booking.date}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #4f46e5; border-radius: 8px; background-color: #f8fafc;">
          <h2 style="color: #4f46e5;">New Appointment Booked</h2>
          <p>A new booking has been received!</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p>👤 <strong>Customer:</strong> ${user.name} (${user.email})</p>
          <p>📞 <strong>Phone:</strong> ${user.phone}</p>
          <p>💈 <strong>Service:</strong> ${service.name}</p>
          <p>📅 <strong>Date:</strong> ${booking.date}</p>
          <p>⏰ <strong>Time:</strong> ${booking.slotTime}</p>
          <p>📝 <strong>Notes:</strong> ${booking.notes || 'No notes'}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Manage this booking in the Admin Dashboard.</p>
        </div>
      `,
    });

    if (error) throw new Error(error.message);
    console.log(`✅ [Email] Admin alert sent successfully`);
    return data;
  } catch (error) {
    console.error(`❌ [Email] Error sending admin alert: ${error.message}`);
  }
};

/**
 * Sends an appointment reminder email.
 */
const sendReminder = async (user, booking, service) => {
  try {
    if (!resend) return;

    const { data, error } = await resend.emails.send({
      from: 'Slotify Salon <onboarding@resend.dev>',
      to: user.email,
      subject: '🚨 HURRY UP! Your slot is waiting - Slotify Salon',
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
    });

    if (error) throw new Error(error.message);
    console.log(`📧 [Email] Reminder sent to ${user.email}`);
    return data;
  } catch (error) {
    console.error(`❌ [Email] Error sending reminder: ${error.message}`);
  }
};

/**
 * Sends a slot expired notification email.
 */
const sendSlotExpired = async (user, booking, service) => {
  try {
    if (!resend) return;

    const { data, error } = await resend.emails.send({
      from: 'Slotify Salon <onboarding@resend.dev>',
      to: user.email,
      subject: '⚠️ Appointment Expired - Slotify Salon',
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
    });

    if (error) throw new Error(error.message);
    console.log(`📧 [Email] Expiration notice sent to ${user.email}`);
    return data;
  } catch (error) {
    console.error(`❌ [Email] Error sending expiration notice: ${error.message}`);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendAdminAlert,
  sendReminder,
  sendSlotExpired,
};
