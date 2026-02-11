import db from "../models/index";
const { sequelize } = db;

// Tạo thông báo mới
const createNotification = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!data.title || !data.message || !data.type || !data.created_by) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin bắt buộc cho thông báo",
                });
                return;
            }

            // Sử dụng transaction để đảm bảo tính nhất quán
            const result = await sequelize.transaction(async (t) => {
                // 1. Tạo thông báo chung
                const notification = await db.Notification.create({
                    type: data.type,
                    title: data.title,
                    message: data.message,
                    reference_id: data.reference_id || null,
                    reference_type: data.reference_type || null,
                    link: data.link || null,
                    created_by: data.created_by,
                    created_at: new Date()
                }, { transaction: t });

                // 2. Xác định người nhận
                let userIds = [];
                
                // Nếu cung cấp danh sách user_ids cụ thể
                if (data.user_ids && Array.isArray(data.user_ids) && data.user_ids.length > 0) {
                    userIds = data.user_ids;
                }
                // Nếu gửi cho tất cả người dùng
                else if (data.send_to_all) {
                    const users = await db.User.findAll({
                        attributes: ['id'],
                        raw: true,
                        transaction: t
                    });
                    userIds = users.map(user => user.id);
                }
                // Nếu gửi cho nhóm người dùng theo role
                else if (data.role_code) {
                    const users = await db.User.findAll({
                        where: {
                            roleCode: data.role_code
                        },
                        attributes: ['id'],
                        raw: true,
                        transaction: t
                    });
                    userIds = users.map(user => user.id);
                }
                // Không có người nhận
                else if (!data.user_id) {
                    resolve({
                        errCode: 2,
                        errMessage: "Không xác định được người nhận thông báo",
                    });
                    return;
                }
                // Nếu gửi cho một người dùng cụ thể
                else {
                    userIds = [data.user_id];
                }

                // 3. Tạo các bản ghi người nhận
                const recipients = userIds.map(userId => ({
                    notification_id: notification.id,
                    user_id: userId,
                    is_read: false,
                    read_at: null,
                    assigned_at: new Date()
                }));

                await db.NotificationRecipient.bulkCreate(recipients, { transaction: t });

                return {
                    notification,
                    recipientCount: recipients.length
                };
            });

            resolve({
                errCode: 0,
                errMessage: "Tạo thông báo thành công",
                data: {
                    id: result.notification.id,
                    recipientCount: result.recipientCount
                }
            });
        } catch (error) {
            console.error("Lỗi khi tạo thông báo:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
                error: error.message
            });
        }
    });
};

// Lấy thông báo của một người dùng
const getUserNotifications = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu ID người dùng",
                });
                return;
            }

            // Lấy thông báo mà người dùng đã nhận
            const notifications = await db.Notification.findAll({
                include: [
                    {
                        model: db.NotificationRecipient,
                        as: 'recipients',
                        where: { user_id: userId },
                        attributes: ['is_read', 'read_at'],
                        required: true
                    },
                    {
                        model: db.User,
                        as: 'creator',
                        attributes: ['id', 'firstName', 'lastName', 'email'],
                        required: false
                    },

                ],
                order: [['created_at', 'DESC']],
                nest: true
            });

            // Chuyển đổi định dạng dữ liệu để dễ sử dụng ở frontend
            const formattedNotifications = notifications.map(notification => {
                const recipientData = notification.recipients[0];
                
                return {
                    id: notification.id,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    is_read: recipientData.is_read,
                    read_at: recipientData.read_at,
                    created_at: notification.created_at,
                    reference_id: notification.reference_id,
                    reference_type: notification.reference_type,
                    link: notification.link,
                    creator: notification.creator,
                    relatedEvent: notification.eventReference
                };
            });

            resolve({
                errCode: 0,
                errMessage: "Lấy thông báo thành công",
                data: formattedNotifications,
                unreadCount: formattedNotifications.filter(n => !n.is_read).length
            });
        } catch (error) {
            console.error("Lỗi khi lấy thông báo người dùng:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
                error: error.message
            });
        }
    });
};

// Đánh dấu thông báo đã đọc
const markNotificationAsRead = async (notificationId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!notificationId || !userId) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu ID thông báo hoặc ID người dùng",
                });
                return;
            }

            // Tìm kiếm trong bảng trung gian
            const recipient = await db.NotificationRecipient.findOne({
                where: {
                    notification_id: notificationId,
                    user_id: userId
                }
            });

            if (!recipient) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy thông báo cho người dùng này",
                });
                return;
            }

            // Nếu chưa đọc, đánh dấu là đã đọc
            if (!recipient.is_read) {
                await recipient.update({
                    is_read: true,
                    read_at: new Date()
                });
            }

            resolve({
                errCode: 0,
                errMessage: "Đã đánh dấu thông báo là đã đọc",
                data: {
                    id: notificationId,
                    is_read: true,
                    read_at: recipient.read_at
                }
            });
        } catch (error) {
            console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
                error: error.message
            });
        }
    });
};

export default {
    createNotification,
    getUserNotifications,
    markNotificationAsRead
};