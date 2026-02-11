import db from "../models/index";
import eventServices from "../service/eventServices";

const createEvent = async (req, res) => {
    try {
        const data = req.body;
        const response = await eventServices.createEvent(data);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Create event error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let createEventDescription = async (req, res) => {
    try {
        let response = await eventServices.createEventDescription(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.error("Error:", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const response = await eventServices.getAllEvents();
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get all events error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};

const getRecentEvents = async (req, res) => {
    try {
        const response = await eventServices.getRecentEvents();
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get recent events error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};

const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;

        if (!eventId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu tham số ID sự kiện",
            });
        }

        const response = await eventServices.getEventById(eventId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get event by ID error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};

const registerEvent = async (req, res) => {
    try {
        const response = await eventServices.registerEvent(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Register event error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};

const getEventRegistrationsById = async (req, res) => {
    try {
        const eventId = req.params.id;

        if (!eventId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu mã sự kiện",
            });
        }
        const response = await eventServices.getEventRegistrationsById(eventId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Get event registrations error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};

const updateEventRegistration = async (req, res) => {
    try {
        // Lấy ID từ params và dữ liệu từ body
        // const registrationId = req.params.id;
        const data = req.body;
        console.log("Update registration data:", data);
        // const registrationId = data.id;
        if (!data.eventId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu ID đăng ký",
            });
        }

        const response = await eventServices.updateEventRegistration(data);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Update registration error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};

const deleteEventRegistration = async (req, res) => {
    try {
        const data = req.body;
        const registrationId = data.id;

        if (!registrationId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu ID đăng ký sự kiện",
            });
        }

        const response = await eventServices.deleteEventRegistration(registrationId);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Delete event registration error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};
let updateEvent = async (req, res) => {
    try {
        let response = await eventServices.updateEvent(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.error("Error handling event update/create:", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};
let deleteEvent = async (req, res) => {
    try {
        let data = req.body;
        console.log("Delete event data:", data);
        const eventId = data.id; // Lấy ID từ URL
        if (!eventId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: "Thiếu ID sự kiện",
            });
        }

        let response = await eventServices.deleteEvent(eventId);
        return res.status(200).json(response);
    } catch (e) {
        console.error("Error deleting event:", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi từ server",
        });
    }
};

module.exports = {
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
