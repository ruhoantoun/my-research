import axios from "axios";
const createNotification = (data) => {
    return axios.post(`http://localhost:2004/api/notification/create`, data);
};

const getUserNotifications = (userId) => {
    return axios.post(`http://localhost:2004/api/notification/get`, userId);
};
const markNotificationAsRead = (data) => {
    return axios.put(`http://localhost:2004/api/notification/mark`, data);
};
export {
    createNotification,
    getUserNotifications,
    markNotificationAsRead

};
