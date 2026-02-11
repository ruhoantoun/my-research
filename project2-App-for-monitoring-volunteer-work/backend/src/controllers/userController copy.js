import db from "../models/index";
import userServices from "../service/userServices";
import eventServices from "../service/eventServices";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "nhập email và password",
        });
    }
    let userData = await userServices.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user,
    });
};

const getAllCodes = async (req, res) => {
    try {
        let type = req.query.type;
        const response = await userServices.getAllCodes(type);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get all codes error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

const createUser = async (req, res) => {
    try {
        const data = req.body;
        if (
            !data.email ||
            !data.password ||
            !data.firstName ||
            !data.lastName
        ) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required parameters",
            });
        }

        const response = await userServices.createUser(data);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Create user error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const response = await userServices.getAllUsers();
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get all users error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let updateUser = async (req, res) => {
    try {
        let data = req.body;
        let message = await userServices.updateUser(data);
        return res.status(200).json(message);
    } catch (e) {
        console.log("Error:", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let deleteUser = async (req, res) => {
    try {
        let id = req.body.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter!",
            });
        }
        let message = await userServices.deleteUser(id);
        return res.status(200).json(message);
    } catch (e) {
        console.log("Error:", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};


let createUserDescription = async (req, res) => {
    try {
        let response = await userServices.createUserDescription(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.error("Error:", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};


let getUsersByRole = async (req, res) => {
    try {
        let roleCode = req.params.roleCode;
        if (!roleCode) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required parameter: roleCode",
            });
        }
        let response = await userServices.getUsersByRole(roleCode);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get users by position error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getUsersByPosition = async (req, res) => {
    try {
        let positionCode = req.params.positionCode;
        if (!positionCode) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required parameter: positionCode",
            });
        }
        let response = await userServices.getUsersByPosition(positionCode);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get users by position error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let getUserById = async (req, res) => {
    try {
        let userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Missing required parameter: id",
            });
        }
        let response = await userServices.getUserById(userId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get user by ID error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

const createHelpRequest = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const data = req.body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!data.full_name || !data.email || !data.phone || 
            !data.help_type || !data.urgency_level || !data.problem_detail) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu thông tin bắt buộc! Vui lòng cung cấp họ tên, email, số điện thoại, loại hỗ trợ, mức độ khẩn cấp và chi tiết vấn đề."
            });
        }

        // Gọi service để xử lý tạo mới
        const response = await userServices.createHelpRequest(data);
        
        // Trả về kết quả
        return res.status(200).json(response);
    } catch (error) {
        console.error("Lỗi controller khi tạo yêu cầu hỗ trợ:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ máy chủ"
        });
    }
};


const getAllHelpRequest = async (req, res) => {
    try {
        const response = await userServices.getAllHelpRequest();
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get all help request error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
module.exports = {
    handleLogin: handleLogin,
    getAllCodes: getAllCodes,
    createUser: createUser,
    getAllUsers: getAllUsers,
    updateUser: updateUser,
    deleteUser: deleteUser,
    createUserDescription: createUserDescription,
    getUsersByPosition: getUsersByPosition, // Add new function
    getUserById: getUserById,
    getUsersByRole:getUsersByRole,
    createHelpRequest: createHelpRequest,
    getAllHelpRequest: getAllHelpRequest    
};
