import { config } from 'dotenv';
import nodemailer from 'nodemailer'

config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

transporter.verify(function (error, success) {
    console.log("Server is ready to take our messages");
});

const sendAccountVerificationEmail = async (email: string, names: string, verificationToken: string) => {
    try {
        const info = transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "NE NodeJS Account Verification",
            html:
                `
            <!DOCTYPE html>
                <html>
                <body>
                    <h2>Dear ${names}, </h2>
                    <h2> To verify your account. Click the link below or use the code below</h2>
                    <strong>Verification code: ${verificationToken}</strong> <br/> or
                    <a href="${process.env.CLIENT_URL}/auth/verify-email/${verificationToken}" style="color:#4200FE;letter-spacing: 2px;">Click here</a>
                    <span>The code expires in 6 hours</span>
                    <p>Best regards,<br>NE NodeJS</p>
                </body>
            </html>
            `

        });

        return {
            message: "Email sent successfully",
            status: true
        };
    } catch (error) {
        return { message: "Unable to send email", status: false };
    }
};

const sendPaswordResetEmail = async (email: string, names: string, passwordResetToken: string) => {
    try {
        const info = transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "NE NodeJS Password Reset",
            html:
                `
            <!DOCTYPE html>
                <html>
                <body>
                    <h2>Dear ${names}, </h2>
                    <h2> Click on the link below to change you password or use the code below</h2>
                    <strong>Reset code: ${passwordResetToken}</strong> <br/> or
                    <a href="${process.env.CLIENT_URL}/auth/reset-password/${passwordResetToken}" style="color:#4200FE;letter-spacing: 2px;">Click here</a>
                    <span>The code expires in 6 hours</span>
                    <p>Best regards,<br>NE NodeJS</p>
                </body>
            </html>
            `

        });

        return {
            message: "Email sent successfully",
            status: true
        };
    } catch (error) {
        return { message: "Unable to send email", status: false };
    }
};

export { sendAccountVerificationEmail, sendPaswordResetEmail };