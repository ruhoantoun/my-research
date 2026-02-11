import db from "../models/index";
import notificationServices from "../service/notificationServices";

// Tạo thông báo mới
const handleCreateNotification = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const response = await notificationServices.createNotification(req.body);

        return res.status(200).json(response);
    } catch (error) {
        console.error("Lỗi khi tạo thông báo:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
            error: error.message
        });
    }
};

// Lấy danh sách thông báo của người dùng
const handleGetUserNotifications = async (req, res) => {
    try {
        const userId = req.body.id;
        // Kiểm tra xem userId có tồn tại không
        if (!userId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu userId",
            });
        }
        
        const response = await notificationServices.getUserNotifications(userId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
            error: error.message
        });
    }
};

// Đánh dấu thông báo đã đọc
const handleMarkNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.body.notificationId;
        const userId = req.body.userId;
        console.log("notificationId", req.body);
        
        if (!notificationId || !userId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu ID thông báo hoặc ID người dùng",
            });
        }
        
        const response = await notificationServices.markNotificationAsRead(notificationId, userId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
            error: error.message
        });
    }
};

module.exports = {
    handleCreateNotification,
    handleGetUserNotifications,
    handleMarkNotificationAsRead
};