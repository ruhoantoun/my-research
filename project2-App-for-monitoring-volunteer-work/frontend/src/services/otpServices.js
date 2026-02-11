// services/userServices.js
import axios from "axios";

const RequestPasswordReset = (email) => {
    return axios.post("http://localhost:2004/api/forgot-password/request", { email });
};

const VerifyOTP = (email, otp) => {
    return axios.post("http://localhost:2004/api/forgot-password/verify-otp", { email, otp });
};

const ResetPassword = (email, resetToken, newPassword) => {
    return axios.post("http://localhost:2004/api/forgot-password/reset", { email, resetToken, newPassword });
};



export { 
    RequestPasswordReset, 
    VerifyOTP, 
    ResetPassword
}