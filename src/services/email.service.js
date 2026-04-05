require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});



// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Fintech Ledger" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to Fintech Ledger!"

    const text = `Hello ${name},

Welcome to Fintech Ledger!

We're excited to have you on board. Fintech Ledger helps you manage your finances, track transactions, and gain better insights into your financial activity.

Your account has been successfully created, and you're now ready to explore all the features available to you.

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,  
The Fintech Ledger Team`

    const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            
            <div style="background: #4f46e5; padding: 25px; text-align: center; color: white;">
                <h1 style="margin: 0;">Fintech Ledger</h1>
                <p style="margin: 5px 0 0; font-size: 14px;">Smart Financial Management</p>
            </div>

            <div style="padding: 30px; color: #333;">
                
                <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                    alt="Welcome"
                    style="width: 100%; border-radius: 8px; margin-bottom: 20px;"
                />

                <h2 style="margin-top: 0;">Welcome, ${name} 👋</h2>

                <p style="line-height: 1.6;">
                    Thank you for joining <strong>Fintech Ledger</strong>. We're thrilled to have you with us.
                    Our platform is designed to give you complete control over your financial data 
                    with simplicity, security, and powerful insights.
                </p>

                <p style="line-height: 1.6;">
                    With your new account, you can:
                </p>

                <ul style="line-height: 1.8; padding-left: 20px;">
                    <li>Track and manage your daily transactions</li>
                    <li>Monitor your financial activity in real-time</li>
                    <li>Gain meaningful insights into your spending habits</li>
                    <li>Maintain a secure and organized financial record</li>
                </ul>

                <p style="line-height: 1.6;">
                    Your account has been successfully created and is ready to use. 
                    You can log in anytime to begin managing your finances efficiently.
                </p>

                <p style="line-height: 1.6;">
                    At Fintech Ledger, security is a top priority. Your data is handled with strict 
                    protection measures to ensure your financial information remains safe and private.
                </p>

                <p style="line-height: 1.6;">
                    If you have any questions, need assistance, or want to provide feedback, 
                    simply reply to this email — we're here to help.
                </p>

                <p style="margin-top: 25px;">
                    Best regards,<br>
                    <strong>The Fintech Ledger Team</strong>
                </p>

            </div>

            <div style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #888;">
                © ${new Date().getFullYear()} Fintech Ledger. All rights reserved.
            </div>

        </div>
    </div>
    `

    await sendEmail(userEmail, subject, text, html)
}


module.exports = {
    sendRegistrationEmail
};