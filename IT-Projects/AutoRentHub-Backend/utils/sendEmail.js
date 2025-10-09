// utils/sendEmail.js
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // CORRECTED: The Nodemailer function is createTransport, not createTransporter.
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // Setting secure: false for port 587 (STARTTLS).
    // If you were using port 465, this should be secure: true
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  // The transporter creation must be inside an async function or block 
  // if you were handling errors during setup, but for config-based setup,
  // it's fine here.
  const transporter = createTransporter();

  const mailOptions = {
    // Ensures a fallback name if FROM_NAME is not set
    from: `${process.env.FROM_NAME || 'Auto Rent Hub'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    // Use options.html if available, otherwise fallback to options.message
    html: options.html || options.message 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // Logging the response from the server is helpful for debugging
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    // Log the detailed error from Nodemailer/SMTP server
    console.error('Email sending failed:', error.message);
    // Throw a generic error for the calling function to handle
    throw new Error('Email could not be sent');
  }
};

// Email templates (No changes needed, they are correct)
const emailTemplates = {
  welcome: (name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Auto Rent Hub!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering with Auto Rent Hub. We're excited to have you as part of our community!</p>
      <p>You can now browse and book our wide range of vehicles for your travel needs.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <br>
      <p>Best regards,<br>Auto Rent Hub Team</p>
    </div>
  `,
  
  bookingConfirmation: (booking, user, vehicle) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Booking Confirmed!</h2>
      <p>Dear ${user.name},</p>
      <p>Your booking has been confirmed. Here are the details:</p>
      <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Vehicle:</strong> ${vehicle.brand} ${vehicle.model}</p>
        <p><strong>Pickup Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>Return Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
        <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
      </div>
      <p>Please arrive 15 minutes early for pickup.</p>
      <p>Best regards,<br>Auto Rent Hub Team</p>
    </div>
  `,
  
  paymentConfirmation: (payment, booking) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Payment Received!</h2>
      <p>Your payment has been successfully processed.</p>
      <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
        <p><strong>Payment ID:</strong> ${payment.paymentId}</p>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Amount:</strong> $${payment.amount}</p>
        <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
      </div>
      <p>Thank you for your payment!</p>
      <p>Best regards,<br>Auto Rent Hub Team</p>
    </div>
  `
};

module.exports = {
  sendEmail,
  emailTemplates
};