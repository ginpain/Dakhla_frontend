// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, message } = req.body;

    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.example.com", // Replace with your SMTP server details
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your-email@example.com', // Your email address
        pass: 'your-email-password', // Your email password
      },
    });

    // Setup email content
    let mailOptions = {
      from: '"Your Name" <your-email@example.com>', // Sender address
      to: "name@example.com", // Receiver email address
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
