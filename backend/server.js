// Import required packages
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
// Make sure to load environment variables right at the top
require('dotenv').config();

// --- Robust check for environment variables ---
console.log("Server script started. Checking environment variables...");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const recipientEmail = process.env.RECIPIENT_EMAIL;

console.log(`EMAIL_USER found: ${emailUser ? 'Yes' : 'No'}`);
console.log(`EMAIL_PASS found: ${emailPass ? 'Yes' : 'No'}`);
console.log(`RECIPIENT_EMAIL found: ${recipientEmail ? 'Yes' : 'No'}`);

// Check for missing or empty variables
if (!emailUser || !emailPass || !recipientEmail) {
    console.error("\nFATAL ERROR: One or more required environment variables (EMAIL_USER, EMAIL_PASS, RECIPIENT_EMAIL) are missing or empty in your .env file.");
    console.error("Please check that the .env file is saved in the 'backend' folder and contains all required keys.");
    process.exit(1); // Stop the server if configuration is incomplete
}

console.log("Environment variables loaded successfully. Starting full server...");

try {
    // Initialize the app
    const app = express();
    const PORT = process.env.PORT || 3001;

    // Middleware
    app.use(cors()); // Allows requests from your frontend
    app.use(express.json()); // Parses incoming JSON requests

    // POST route to handle form submission
    app.post('/send-email', (req, res) => {
        const { fullName, email, mobile, subject, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        const mailOptions = {
            from: `"${fullName}" <${email}>`,
            to: recipientEmail,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h2>New Message from Portfolio Contact Form</h2>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <hr>
                <h3>Message:</h3>
                <p>${message}</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Failed to send message. Please check server logs.' });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({ success: true, message: 'Message sent successfully!' });
        });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`--- Full server is running successfully on port ${PORT} ---`);
        console.log("Ready to receive contact form submissions.");
    });

} catch (error) {
    console.error("A fatal error occurred during server startup:", error);
    process.exit(1);
}

