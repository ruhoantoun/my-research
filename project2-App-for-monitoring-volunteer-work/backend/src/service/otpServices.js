import db from "../models/index";
import bcrypt from "bcryptjs";
import emailConfig from "../config/emailConfig";

// Tạo OTP ngẫu nhiên 6 chữ số
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Gửi OTP qua email
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: emailConfig.from,
            to: email,
            subject: "Mã xác thực đặt lại mật khẩu",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #4a6ee0; text-align: center;">Đặt lại mật khẩu CTES</h2>
                    <p>Xin chào,</p>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                    <p>Đây là mã xác thực OTP của bạn:</p>
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0;">
                        <h2 style="margin: 0; letter-spacing: 6px; color: #333;">${otp}</h2>
                    </div>
                    <p>Mã xác thực này sẽ hết hạn sau <strong>5 phút</strong>.</p>
                    <p style="color: #e74c3c; font-weight: bold;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777; text-align: center;">© ${new Date().getFullYear()} CTES. Bản quyền thuộc về CTES.</p>
                </div>
            `,
        };

        return await emailConfig.transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        throw error;
    }
};

// 1. Khởi tạo quá trình đặt lại mật khẩu
const requestPasswordReset = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm user theo email
            const user = await db.User.findOne({ where: { email } });

            if (!user) {
                return resolve({
                    errCode: 1,
                    errMessage: "Email không tồn tại trong hệ thống",
                });
            }

            // Tạo OTP mới
            const otp = generateOTP();

            // Thời gian hết hạn: 5 phút từ hiện tại
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

            // Cập nhật thông tin OTP cho user
            await user.update({
                otp: otp,
                otpExpiry: otpExpiry,
                otpAttempts: 0,
            });

            // Gửi OTP qua email
            await sendOTPEmail(email, otp);

            resolve({
                errCode: 0,
                errMessage: "Mã OTP đã được gửi đến email của bạn",
                email: email,
            });
        } catch (error) {
            console.error("Lỗi trong quá trình yêu cầu đặt lại mật khẩu:", error);
            reject({
                errCode: -1,
                errMessage: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
                error: error.message,
            });
        }
    });
};

// 2. Xác thực OTP
const verifyOTP = (data) => {
    const { email, otp } = data;

    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra thông tin đầu vào
            if (!email || !otp) {
                return resolve({
                    errCode: 1,
                    errMessage: "Vui lòng cung cấp đầy đủ thông tin email và mã OTP",
                });
            }

            // Tìm user theo email
            const user = await db.User.findOne({ where: { email } });

            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: "Email không tồn tại trong hệ thống",
                });
            }

            // Kiểm tra số lần thử
            if (user.otpAttempts >= 3) {
                return resolve({
                    errCode: 3,
                    errMessage: "Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu mã mới.",
                });
            }

            // Kiểm tra OTP đã hết hạn chưa
            if (user.otpExpiry < new Date()) {
                return resolve({
                    errCode: 4,
                    errMessage: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.",
                });
            }

            // Kiểm tra OTP có đúng không
            if (user.otp !== otp) {
                // Tăng số lần thử
                await user.increment("otpAttempts");

                return resolve({
                    errCode: 5,
                    errMessage: `Mã OTP không chính xác. Bạn còn ${3 - (user.otpAttempts + 1)} lần thử.`,
                });
            }

            // OTP hợp lệ, tạo token xác thực
            const resetToken = require("crypto").randomBytes(32).toString("hex");

            // Lưu token vào user và đặt thời hạn 15 phút
            const tokenExpiry = new Date();
            tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 15);

            await user.update({
                otp: resetToken, // Sử dụng lại trường OTP để lưu token
                otpExpiry: tokenExpiry,
            });

            resolve({
                errCode: 0,
                errMessage: "Xác thực OTP thành công",
                email: email,
                resetToken: resetToken,
            });
        } catch (error) {
            console.error("Lỗi khi xác thực OTP:", error);
            reject({
                errCode: -1,
                errMessage: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
                error: error.message,
            });
        }
    });
};

// 3. Đặt lại mật khẩu
const resetPassword = (data) => {
    const { email, resetToken, newPassword } = data;
    
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra thông tin đầu vào
            if (!email || !resetToken || !newPassword) {
                return resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin cần thiết",
                });
            }

            // Kiểm tra độ phức tạp của mật khẩu
            if (newPassword.length < 6) {
                return resolve({
                    errCode: 2,
                    errMessage: "Mật khẩu phải có ít nhất 6 ký tự",
                });
            }

            // Tìm user với email và token hợp lệ
            const user = await db.User.findOne({
                where: {
                    email: email,
                    otp: resetToken,
                    otpExpiry: { [db.Sequelize.Op.gt]: new Date() }, // Token chưa hết hạn
                },
            });

            if (!user) {
                return resolve({
                    errCode: 3,
                    errMessage: "Yêu cầu đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
                });
            }

            // Hash mật khẩu mới
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(newPassword, salt);

            // Cập nhật mật khẩu và xóa thông tin OTP
            await user.update({
                password: hashedPassword,
                otp: null,
                otpExpiry: null,
                otpAttempts: 0,
            });

            resolve({
                errCode: 0,
                errMessage: "Đặt lại mật khẩu thành công",
            });
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            reject({
                errCode: -1,
                errMessage: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
                error: error.message,
            });
        }
    });
};

module.exports = {
    requestPasswordReset,
    verifyOTP,
    resetPassword,
};
