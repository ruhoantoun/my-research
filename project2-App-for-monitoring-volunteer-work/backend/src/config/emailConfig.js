import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailConfig = {
    // Cấu hình SMTP cho Gmail
    transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME, // email của bạn
            pass: process.env.EMAIL_APP_PASSWORD, // app password của Gmail
        },
    }),

    // Thông tin người gửi mặc định
    from: `"CTES Support" <${process.env.EMAIL_USERNAME}>`,
};

export default emailConfig;
