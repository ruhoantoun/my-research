import otpServices from "../service/otpServices";

// 1. API yêu cầu đặt lại mật khẩu
const handleRequestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Controller: Yêu cầu đặt lại mật khẩu:", email);
        // Kiểm tra email
        if (!email) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Vui lòng cung cấp địa chỉ email",
            });
        }

        // Xử lý yêu cầu qua service
        const response = await otpServices.requestPasswordReset(email);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Controller: Lỗi yêu cầu đặt lại mật khẩu:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Đã xảy ra lỗi từ server",
            error: error.message,
        });
    }
};

// 2. API xác thực OTP
const handleVerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Kiểm tra đầu vào
        if (!email || !otp) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Vui lòng cung cấp email và mã OTP",
            });
        }

        // Xử lý xác thực qua service
        const response = await otpServices.verifyOTP({ email, otp });
        return res.status(200).json(response);
    } catch (error) {
        console.error("Controller: Lỗi xác thực OTP:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Đã xảy ra lỗi từ server",
            error: error.message,
        });
    }
};

// 3. API đặt lại mật khẩu
const handleResetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;
        console.log("Controller: Đặt lại mật khẩu:", email, resetToken, newPassword);

        // Kiểm tra đầu vào
        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu thông tin cần thiết",
            });
        }

        // Xử lý đặt lại mật khẩu qua service
        const response = await otpServices.resetPassword({ email, resetToken, newPassword });
        return res.status(200).json(response);
    } catch (error) {
        console.error("Controller: Lỗi đặt lại mật khẩu:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Đã xảy ra lỗi từ server",
            error: error.message,
        });
    }
};

module.exports = {
    handleRequestPasswordReset,
    handleVerifyOTP,
    handleResetPassword,
};
