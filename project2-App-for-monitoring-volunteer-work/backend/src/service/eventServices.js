import db from "../models/index";

const createEvent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra dữ liệu bắt buộc
            if (!data.name || !data.date || !data.address || !data.typeEventCode) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin bắt buộc",
                });
                return;
            }

            // Tạo sự kiện mới
            const newEvent = await db.Event.create({
                typeEventCode: data.typeEventCode,
                name: data.name,
                date: data.date,
                address: data.address,
                quantityMember: data.quantityMember || 0,
                cost: data.cost || 0.0,
                statusCode: data.statusCode || "S1", // Trạng thái mặc định
            });

            resolve({
                errCode: 0,
                errMessage: "Tạo sự kiện thành công",
                id: newEvent.id,
            });
        } catch (error) {
            console.error("Lỗi tạo sự kiện:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

let createEventDescription = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.eventId || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                // Check if description already exists for this event
                let existingMarkdown = await db.Markdown.findOne({
                    where: {
                        eventId: data.eventId,
                    },
                });

                if (existingMarkdown) {
                    // Update existing record
                    await existingMarkdown.update({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        image: data.image,
                    });
                } else {
                    // Create new record
                    await db.Markdown.create({
                        eventId: data.eventId,
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        image: data.image,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save description successfully!",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllEvents = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const events = await db.Event.findAll({
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
                order: [["createdAt", "DESC"]],
                raw: true,
                nest: true,
            });

            if (events && events.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: "Lấy danh sách sự kiện thành công",
                    data: events,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Không có sự kiện nào",
                    data: [],
                });
            }
        } catch (error) {
            console.error("Get all events error:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

const getRecentEvents = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const events = await db.Event.findAll({
                limit: 3,
                include: [
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
                    {
                        model: db.Markdown,
                        as: "eventMarkdown",
                        attributes: ["contentHTML", "contentMarkdown", "description", "image"],
                    },
                ],
                order: [["createdAt", "DESC"]],
                raw: true,
                nest: true,
            });

            if (events && events.length > 0) {
                // Lấy số lượng đăng ký cho mỗi sự kiện
                const eventsWithRegistrationCount = await Promise.all(
                    events.map(async (event) => {
                        const registrationCount = await db.EventRegistration.count({
                            where: { eventId: event.id },
                        });
                        event.registrationCount = registrationCount;
                    })
                );
                resolve({
                    errCode: 0,
                    errMessage: "Lấy danh sách sự kiện thành công",
                    data: events,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Không có sự kiện nào",
                    data: [],
                });
            }
        } catch (error) {
            console.error("Get recent events error:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

const getEventById = (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!eventId) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số ID sự kiện",
                });
                return;
            }

            const event = await db.Event.findOne({
                where: { id: eventId },
                include: [
                    {
                        model: db.Allcode,
                        as: "eventType",
                        attributes: ["keyName", "valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "status",
                        attributes: ["keyName", "valueEn", "valueVi"],
                    },
                    {
                        model: db.Markdown,
                        as: "eventMarkdown",
                        attributes: ["contentHTML", "contentMarkdown", "description", "image"],
                    },
                ],
                raw: true,
                nest: true,
            });

            if (event) {
                // Tính số lượng đăng ký cho sự kiện
                const registrationCount = await db.EventRegistration.count({
                    where: { eventId: eventId },
                });

                // Thêm thông tin đăng ký vào kết quả
                event.registrationCount = registrationCount;

                resolve({
                    errCode: 0,
                    errMessage: "Lấy thông tin sự kiện thành công",
                    data: event,
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy sự kiện",
                    data: {},
                });
            }
        } catch (error) {
            console.error("Get event by ID error:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

const registerEvent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!data.eventId || !data.name || !data.email || !data.phone) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin bắt buộc",
                });
                return;
            }

            // Kiểm tra sự kiện tồn tại
            const event = await db.Event.findByPk(data.eventId);
            if (!event) {
                resolve({
                    errCode: 2,
                    errMessage: "Sự kiện không tồn tại",
                });
                return;
            }
            // Kiểm tra nếu người dùng đã đăng ký sự kiện này trước đó
            if (data.userId) {
                const existingRegistration = await db.EventRegistration.findOne({
                    where: {
                        eventId: data.eventId,
                        userId: data.userId,
                    },
                });

                if (existingRegistration) {
                    resolve({
                        errCode: 3,
                        errMessage: "Bạn đã đăng ký sự kiện này trước đó",
                    });
                    return;
                }
            }
            // Tạo đăng ký
            await db.EventRegistration.create(
                {
                    eventId: data.eventId,
                    name: data.name,
                    userId: data.userId,
                    email: data.email,
                    phoneNumber: data.phone, // Chuyển đổi từ phone sang phoneNumber
                    registeredAt: data.registeredAt || new Date(),
                    statusCostCode: data.statusCostCode || "SC1", // Mã trạng thái mặc định
                    payMethodCode: data.payMethodCode || "PM1", // Mã phương thức thanh toán mặc định
                    notes: data.notes,
                },
                {
                    timestamps: false,
                }
            );

            resolve({
                errCode: 0,
                errMessage: "Đăng ký sự kiện thành công",
            });
        } catch (error) {
            console.error("Register event error:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

const getEventRegistrationsById = (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra sự kiện tồn tại
            const event = await db.Event.findByPk(eventId);
            if (!event) {
                resolve({
                    errCode: 1,
                    errMessage: "Sự kiện không tồn tại",
                    data: [],
                });
                return;
            }

            // Lấy danh sách đăng ký
            const registrations = await db.EventRegistration.findAll({
                where: { eventId: eventId },
                include: [
                    {
                        model: db.User,
                        attributes: ["id", "email", "firstName", "lastName", "address", "phoneNumber"],
                        required: false,
                    },
                    {
                        model: db.Allcode,
                        as: "statusCost",
                        attributes: ["valueEn", "valueVi"],
                        required: false,
                    },
                    {
                        model: db.Allcode,
                        as: "payMethod",
                        attributes: ["valueEn", "valueVi"],
                        required: false,
                    },
                ],
                order: [["registeredAt", "DESC"]],
                raw: true,
                nest: true,
            });

            resolve({
                errCode: 0,
                errMessage: "Lấy danh sách người đăng ký thành công",
                data: registrations,
            });
        } catch (error) {
            console.error("Get event registrations error:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

const updateEventRegistration = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra ID đăng ký tồn tại
            const id = data.id;
            console.log("Update registration id:", id);
            const registration = await db.EventRegistration.findByPk(id);
            console.log("registration:", registration);
            if (!registration) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy thông tin đăng ký",
                });
                return;
            }
            await registration.update(
                {
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    userId: data.userId,
                    // registeredAt: registeredAt|| new Date(),
                    statusCostCode: data.statusCostCode,
                    payMethodCode: data.payMethodCode,
                    attendanceStatus: data.attendanceStatus || 0, // Mặc định là chưa điểm danh
                    attendanceTime: data.attendanceTime || null, // Mặc định là null nếu chưa điểm danh
                    notes: data.notes,
                },
                {
                    timestamps: false,
                }
            );

            resolve({
                errCode: 0,
                errMessage: "Cập nhật thông tin đăng ký thành công",
            });
        } catch (error) {
            console.error("Update event registration error:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

const deleteEventRegistration = (registrationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra đăng ký tồn tại
            const registration = await db.EventRegistration.findByPk(registrationId);
            if (!registration) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy thông tin đăng ký",
                });
                return;
            }

            // Thực hiện xóa
            await db.EventRegistration.destroy({
                where: { id: registrationId },
            });

            resolve({
                errCode: 0,
                errMessage: "Xóa đăng ký sự kiện thành công",
            });
        } catch (error) {
            console.error("Delete event registration error:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};
const updateEvent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra dữ liệu bắt buộc
            if (!data.name || !data.date || !data.address || !data.typeEventCode) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin bắt buộc",
                });
                return;
            }

            let eventId = data.id;
            let event = null;

            // Kiểm tra xem đây là cập nhật hay tạo mới
            if (!eventId) {
                // Tạo sự kiện mới
                event = await db.Event.create({
                    typeEventCode: data.typeEventCode,
                    name: data.name,
                    date: data.date,
                    address: data.address,
                    quantityMember: data.quantityMember ? parseInt(data.quantityMember) : 0,
                    cost: data.cost ? parseFloat(data.cost) : 0.0,
                    statusCode: data.statusCode || "S1",
                });

                resolve({
                    errCode: 0,
                    errMessage: "Tạo sự kiện thành công",
                    data: event,
                });
            } else {
                // Tìm sự kiện hiện có
                event = await db.Event.findOne({
                    where: { id: eventId },
                });

                if (!event) {
                    resolve({
                        errCode: 2,
                        errMessage: "Không tìm thấy sự kiện",
                    });
                    return;
                }

                // Cập nhật sự kiện
                await event.update({
                    typeEventCode: data.typeEventCode,
                    name: data.name,
                    date: data.date,
                    address: data.address,
                    quantityMember: data.quantityMember ? parseInt(data.quantityMember) : 0,
                    cost: data.cost ? parseFloat(data.cost) : 0.0,
                    statusCode: data.statusCode || "S1",
                });

                // Xử lý markdown nếu có
                if (data.description || data.contentMarkdown || data.contentHTML) {
                    let existingMarkdown = await db.Markdown.findOne({
                        where: { eventId: eventId },
                    });

                    if (existingMarkdown) {
                        // Cập nhật markdown hiện có
                        await existingMarkdown.update({
                            description: data.description || existingMarkdown.description,
                            contentMarkdown: data.contentMarkdown || existingMarkdown.contentMarkdown,
                            contentHTML: data.contentHTML || existingMarkdown.contentHTML,
                        });
                    } else {
                        // Tạo mới markdown nếu chưa có
                        await db.Markdown.create({
                            eventId: eventId,
                            description: data.description || "",
                            contentMarkdown: data.contentMarkdown || "",
                            contentHTML: data.contentHTML || "",
                        });
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: "Cập nhật sự kiện thành công",
                    data: event,
                });
            }
        } catch (error) {
            console.error("Lỗi xử lý sự kiện:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

const deleteEvent = (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem sự kiện có tồn tại không
            const event = await db.Event.findOne({
                where: { id: eventId },
            });

            if (!event) {
                resolve({
                    errCode: 1,
                    errMessage: "Không tìm thấy sự kiện",
                });
                return;
            }

            // Xóa sự kiện
            await db.Event.destroy({
                where: { id: eventId },
            });

            resolve({
                errCode: 0,
                errMessage: "Xóa sự kiện thành công",
            });
        } catch (error) {
            console.error("Lỗi khi xóa sự kiện:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};
export default {
    createEvent: createEvent,
    createEventDescription: createEventDescription,
    getAllEvents: getAllEvents,
    getRecentEvents: getRecentEvents,
    getEventById: getEventById,
    registerEvent: registerEvent,
    getEventRegistrationsById: getEventRegistrationsById,
    updateEventRegistration: updateEventRegistration,
    deleteEventRegistration: deleteEventRegistration,
    updateEvent: updateEvent,
    deleteEvent: deleteEvent,
};
