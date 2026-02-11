const db = require("../models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");

/**
 * Lấy thống kê chi tiết của một sự kiện
 * @param {number} eventId - ID của sự kiện cần thống kê
 */
const getEventStatistics = async (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!eventId) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu ID sự kiện",
                });
                return;
            }

            // 1. Lấy thông tin sự kiện
            const event = await db.Event.findOne({
                where: { id: eventId },
                include: [
                    {
                        model: db.Markdown,
                        as: "eventMarkdown",
                        attributes: ["contentHTML", "contentMarkdown", "description"],
                    },
                    {
                        model: db.Allcode,
                        as: "eventType",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "status",
                        attributes: ["valueEn", "valueVi"],
                    },
                ],
            });
            if (!event) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy sự kiện",
                });
                return;
            }

            // 2. Lấy tất cả đăng ký cho sự kiện này
            const registrations = await db.EventRegistration.findAll({
                where: { eventId: eventId },
                include: [
                    {
                        model: db.Allcode,
                        as: "statusCost",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "payMethod",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.User,
                        attributes: ["id", "firstName", "lastName", "email"],
                    },
                ],
            });

            // 3. Tính toán các thống kê

            // a. Thống kê đăng ký
            const totalRegistrations = registrations.length;
            const maxCapacity = event.quantityMember || 0;
            const remainingSlots = Math.max(0, maxCapacity - totalRegistrations);
            const registrationRate = maxCapacity > 0 ? (totalRegistrations / maxCapacity) * 100 : 0;

            // b. Thống kê điểm danh
            const attendedRegistrations = registrations.filter((r) => r.attendanceStatus === true);
            const totalAttended = attendedRegistrations.length;
            const attendanceRate = totalRegistrations > 0 ? (totalAttended / totalRegistrations) * 100 : 0;

            // Thời gian điểm danh
            let earliestAttendance = null;
            let latestAttendance = null;

            if (totalAttended > 0) {
                // Sắp xếp theo thời gian điểm danh
                const sortedByAttendance = [...attendedRegistrations].sort((a, b) => new Date(a.attendanceTime) - new Date(b.attendanceTime));

                earliestAttendance = sortedByAttendance[0].attendanceTime;
                latestAttendance = sortedByAttendance[sortedByAttendance.length - 1].attendanceTime;
            }

            // c. Thống kê thanh toán
            const eventCost = parseFloat(event.cost) || 0;
            const expectedRevenue = eventCost * event.quantityMember || 0;

            // Thống kê theo trạng thái thanh toán (statusCostCode)
            const paymentStatusStats = {};
            const paymentMethodStats = {};
            let totalPaid = 0;

            registrations.forEach((reg) => {
                // Thống kê theo trạng thái thanh toán
                const statusKey = reg.statusCostCode || "unknown";
                if (!paymentStatusStats[statusKey]) {
                    paymentStatusStats[statusKey] = {
                        code: statusKey,
                        name: reg.statusCost ? reg.statusCost.valueVi : "Không xác định",
                        count: 0,
                        amount: 0,
                    };
                }
                paymentStatusStats[statusKey].count++;
                paymentStatusStats[statusKey].amount += eventCost;

                // Thống kê theo phương thức thanh toán
                if (reg.payMethodCode) {
                    const methodKey = reg.payMethodCode;
                    if (!paymentMethodStats[methodKey]) {
                        paymentMethodStats[methodKey] = {
                            code: methodKey,
                            name: reg.payMethod ? reg.payMethod.valueVi : "Không xác định",
                            count: 0,
                            amount: 0,
                        };
                    }
                    paymentMethodStats[methodKey].count++;
                    paymentMethodStats[methodKey].amount += eventCost;
                }
                console.log(`Registration ID: ${reg.id}, Status: ${reg.statusCostCode}, Method: ${reg.payMethodCode}`);
                // Tính tổng số tiền đã thanh toán (giả sử statusCostCode = 'S2' là đã thanh toán)
                if (reg.statusCostCode === "PS1") {
                    totalPaid += eventCost;
                }
            });

            // Thống kê thời gian đăng ký
            let registrationTimeStats = null;
            if (totalRegistrations > 0) {
                const regDates = registrations.map((r) => new Date(r.registeredAt));
                const earliestReg = new Date(Math.min(...regDates));
                const latestReg = new Date(Math.max(...regDates));

                // Tạo phân phối đăng ký theo ngày
                const registrationsByDay = {};
                registrations.forEach((reg) => {
                    const day = new Date(reg.registeredAt).toISOString().split("T")[0];
                    if (!registrationsByDay[day]) {
                        registrationsByDay[day] = 0;
                    }
                    registrationsByDay[day]++;
                });

                registrationTimeStats = {
                    earliest: earliestReg,
                    latest: latestReg,
                    distribution: Object.entries(registrationsByDay)
                        .map(([date, count]) => ({
                            date,
                            count,
                        }))
                        .sort((a, b) => new Date(a.date) - new Date(b.date)),
                };
            }

            // 4. Tổng hợp kết quả
            const result = {
                // Thông tin cơ bản về sự kiện
                eventInfo: {
                    id: event.id,
                    name: event.name,
                    date: event.date,
                    address: event.address,
                    type: event.eventType ? event.eventType.valueVi : null,
                    status: event.status ? event.status.valueVi : null,
                    capacity: maxCapacity,
                    cost: eventCost,
                    description: event.eventMarkdown ? event.eventMarkdown.description : null,
                },

                // Thống kê đăng ký
                registrationStats: {
                    total: totalRegistrations,
                    remainingSlots: remainingSlots,
                    registrationRate: registrationRate.toFixed(2),
                    timeStats: registrationTimeStats,
                },

                // Thống kê điểm danh
                attendanceStats: {
                    attended: totalAttended,
                    notAttended: totalRegistrations - totalAttended,
                    attendanceRate: attendanceRate.toFixed(2),
                    earliestAttendance: earliestAttendance,
                    latestAttendance: latestAttendance,
                },

                // Thống kê thanh toán
                paymentStats: {
                    expectedRevenue: expectedRevenue,
                    totalPaid: totalPaid,
                    totalUnpaid: expectedRevenue - totalPaid,
                    paymentRate: expectedRevenue > 0 ? ((totalPaid / expectedRevenue) * 100).toFixed(2) : 0,
                    byStatus: Object.values(paymentStatusStats),
                    byMethod: Object.values(paymentMethodStats),
                },

                // Danh sách đăng ký (có thể thêm phân trang nếu cần)
                registrations: registrations.map((reg) => ({
                    id: reg.id,
                    name: reg.name,
                    email: reg.email,
                    phoneNumber: reg.phoneNumber,
                    registeredAt: reg.registeredAt,
                    paymentStatus: reg.statusCost ? reg.statusCost.valueVi : null,
                    paymentMethod: reg.payMethod ? reg.payMethod.valueVi : null,
                    attended: reg.attendanceStatus,
                    attendanceTime: reg.attendanceTime,
                    notes: reg.notes,
                    user: reg.User
                        ? {
                              id: reg.User.id,
                              name: `${reg.User.firstName} ${reg.User.lastName}`,
                              email: reg.User.email,
                          }
                        : null,
                })),
            };

            resolve({
                errCode: 0,
                errMessage: "Lấy thống kê sự kiện thành công",
                data: result,
            });
        } catch (error) {
            console.error("Lỗi khi lấy thống kê sự kiện:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
                error: error.message,
            });
        }
    });
};

module.exports = {
    getEventStatistics,
};
