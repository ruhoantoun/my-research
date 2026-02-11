import eventStatService from "../service/eventStatService";

// Lấy thống kê chi tiết của một sự kiện
const getEventStatistics = async (req, res) => {
    try {
        const eventId = req.body.eventId;
        console.log("Lấy thống kê sự kiện với ID:", eventId);
        if (!eventId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu ID sự kiện",
            });
        }

        const response = await eventStatService.getEventStatistics(eventId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Lỗi controller thống kê sự kiện:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
            error: error.message,
        });
    }
};

module.exports = {
    getEventStatistics,
};
