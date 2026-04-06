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


async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Successful 💸";

    const text = `Hello ${name},

Your transaction was successfully completed.

Amount: $${amount}
Recipient Account: ${toAccount}

The funds have been securely transferred and recorded in your Fintech Ledger account.

You can log in anytime to review your transaction history and monitor your financial activity.

If you did not authorize this transaction, please contact our support team immediately.

Best regards,  
The Fintech Ledger Team`;

    const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            
            <div style="background: #16a34a; padding: 25px; text-align: center; color: white;">
                <h1 style="margin: 0;">Transaction Successful</h1>
                <p style="margin: 5px 0 0; font-size: 14px;">Fintech Ledger</p>
            </div>

            <div style="padding: 30px; color: #333;">
                
                <img 
                    src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc"
                    alt="Transaction Success"
                    style="width: 100%; border-radius: 8px; margin-bottom: 20px;"
                />

                <h2 style="margin-top: 0;">Hello, ${name} 👋</h2>

                <p style="line-height: 1.6;">
                    Your transaction has been successfully processed. Below are the details:
                </p>

                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 16px;"><strong>Amount:</strong> $${amount}</p>
                    <p style="margin: 5px 0 0; font-size: 16px;"><strong>Recipient Account:</strong> ${toAccount}</p>
                </div>

                <p style="line-height: 1.6;">
                    The funds have been securely transferred and recorded in your account. 
                    You can review this transaction anytime from your dashboard.
                </p>

                <p style="line-height: 1.6;">
                    If you notice anything unusual or did not authorize this transaction, 
                    please contact our support team immediately.
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
    `;

    await sendEmail(userEmail, subject, text, html);
}


async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Failed ❌";

    const text = `Hello ${name},

We regret to inform you that your transaction could not be completed.

Amount: $${amount}
Recipient Account: ${toAccount}

No funds have been deducted from your account. This may have occurred due to a temporary issue such as insufficient balance, network errors, or bank-side restrictions.

Please try again after some time or verify your account details.

If the issue persists or you did not attempt this transaction, contact our support team immediately.

Best regards,  
The Fintech Ledger Team`;

    const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            
            <div style="background: #dc2626; padding: 25px; text-align: center; color: white;">
                <h1 style="margin: 0;">Transaction Failed</h1>
                <p style="margin: 5px 0 0; font-size: 14px;">Fintech Ledger</p>
            </div>

            <div style="padding: 30px; color: #333;">
                
                <img 
                    src="https://images.unsplash.com/photo-1580910051074-3eb694886505"
                    alt="Transaction Failed"
                    style="width: 100%; border-radius: 8px; margin-bottom: 20px;"
                />

                <h2 style="margin-top: 0;">Hello, ${name}</h2>

                <p style="line-height: 1.6;">
                    Unfortunately, your recent transaction could not be completed. Here are the details:
                </p>

                <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 16px;"><strong>Amount:</strong> $${amount}</p>
                    <p style="margin: 5px 0 0; font-size: 16px;"><strong>Recipient Account:</strong> ${toAccount}</p>
                </div>

                <p style="line-height: 1.6;">
                    <strong>No funds have been deducted</strong> from your account. This issue may be caused by:
                </p>

                <ul style="line-height: 1.8; padding-left: 20px;">
                    <li>Insufficient balance</li>
                    <li>Temporary network or server issues</li>
                    <li>Bank or payment provider restrictions</li>
                    <li>Incorrect recipient details</li>
                </ul>

                <p style="line-height: 1.6;">
                    Please review the details and try again. If the issue continues, we recommend contacting support for assistance.
                </p>

                <p style="line-height: 1.6;">
                    If you did not initiate this transaction, report it immediately to ensure your account security.
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
    `;

    await sendEmail(userEmail, subject, text, html);
}


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};
