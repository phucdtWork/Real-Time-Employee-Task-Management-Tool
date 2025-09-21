import nodemailer from 'nodemailer';

const sendEmail = async (to, name, setupLink) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SERVICE,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_SERVICE,
        to: to,
        subject: 'Your Account Has Been Created - Set Up Your Credentials',
        html: `
Dear ${name}, <br/>

We are pleased to inform you that your account has been successfully created. <br/>

To complete your account setup, please click the link below to set up your username and password: <br/>

<a href="${setupLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">Set Up Your Account</a> <br/>

Important notes: <br/>
- This setup link will expire in 24 hours for security purposes <br/>
- Please do not share this link with anyone <br/> 
- Once you set up your credentials, you will have full access to the platform <br/>

If you did not expect this account creation, please contact us immediately. <br/>

For any assistance, please contact us at support@example.com or call us at 0123-456-789. <br/>

Best regards, <br/>
Real-Time Employee Task Management Platform Support Team <br/>
Email: support@example.com <br/>
Hotline: 0123-456-789 <br/>
    `,
    };
    await transporter.sendMail(mailOptions);
}

export default sendEmail;