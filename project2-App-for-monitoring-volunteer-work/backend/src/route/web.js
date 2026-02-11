import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import eventController from "../controllers/eventController";
import doctorController from "../controllers/doctorController";
import markdownController from "../controllers/markdownController";
import notificationController from "../controllers/notificationController";
import otpController from "../controllers/otpController";
import eventStatController from '../controllers/eventStatController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.post("/api/login", userController.handleLogin);
    router.get("/api/allcode/get-all", userController.getAllCodes);
    router.post("/api/user/create", userController.createUser);
    router.get("/api/users/get-all", userController.getAllUsers);
    router.get("/api/users/get-user-by-id/:id", userController.getUserById);
    router.get("/api/users/get-user-by-position/:positionCode", userController.getUsersByPosition);
    router.get("/api/users/get-user-by-role/:roleCode", userController.getUsersByRole);
    router.post("/api/user/update", userController.updateUser);
    router.post("/api/user/delete", userController.deleteUser);
    router.post("/api/event/update", eventController.updateEvent);
    router.post("/api/event/delete", eventController.deleteEvent);
    router.post("/api/event/create", eventController.createEvent);
    router.post("/api/event-description/create", eventController.createEventDescription);
    router.get("/api/events/get-recent", eventController.getRecentEvents);
    router.get("/api/event/:id", eventController.getEventById);
    router.get("/api/events/get-all", eventController.getAllEvents);
    router.post("/api/event/register", eventController.registerEvent);
    router.get("/api/events/registrations/:id", eventController.getEventRegistrationsById);
    router.post("/api/events/registration-update", eventController.updateEventRegistration);
    router.post("/api/events/registration-delete", eventController.deleteEventRegistration);
    router.post("/api/user-description/create", userController.createUserDescription);
    router.post("/api/help-request/create", userController.createHelpRequest);
    router.post("/api/help-request/display", userController.getAllHelpRequest);

    // Thông báo routue
    router.post("/api/notification/create", notificationController.handleCreateNotification);
    router.post("/api/notification/get", notificationController.handleGetUserNotifications);
    router.put("/api/notification/mark", notificationController.handleMarkNotificationAsRead);

    // Quên mật khẩu routes
    router.post("/api/forgot-password/request", otpController.handleRequestPasswordReset);
    router.post("/api/forgot-password/verify-otp", otpController.handleVerifyOTP);
    router.post("/api/forgot-password/reset", otpController.handleResetPassword);

    // Thống kê sự kiện
    router.post('/api/events/statistics', eventStatController.getEventStatistics);

    return app.use("/", router);
};

module.exports = initWebRoutes;
