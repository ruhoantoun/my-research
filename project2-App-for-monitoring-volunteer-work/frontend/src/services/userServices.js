// services/userServices.js
import axios from "axios";

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post("http://localhost:2004/api/login", {
        email: userEmail,
        password: userPassword,
    });
};

const getAllCodeService = (type) => {
    return axios.get(`http://localhost:2004/allcode?type=${type}`);
};

const getTopDoctorsService = () => {
    return axios.get(`http://localhost:2004/api/get-all-doctors`);
};

const createMarkdown = (data) => {
    return axios.post(`http://localhost:2004/api/create-markdown`, data);
};
const getDoctorDetailService = (id) => {
    return axios.get(`http://localhost:2004/api/get-detail-doctor-by-id?id=${id}`);
};

export { handleLoginApi };
export { getDoctorDetailService, createMarkdown, getAllCodeService, getTopDoctorsService };

// =========================================================================================
// Sửa lại hàm getAllCodes
const getAllCodes = (type) => {
    return axios.get(`http://localhost:2004/api/allcode/get-all`, {
        params: { type: type },
    });
};
const createUser = (data) => {
    return axios.post(`http://localhost:2004/api/user/create`, data);
};

const getAllUsers = () => {
    return axios.get(`http://localhost:2004/api/users/get-all`);
};
const getUsersByPosition = (positionCode) => {
    return axios.get(`http://localhost:2004/api/users/get-user-by-position/${positionCode}`);
};
const getUsersByRole = (roleCode) => {
    return axios.get(`http://localhost:2004/api/users/get-user-by-role/${roleCode}`);
};
const getUserById = (id) => {
    return axios.get(`http://localhost:2004/api/users/get-user-by-id/${id}`);
};

const updateUser = (data) => {
    return axios.post(`http://localhost:2004/api/user/update`, data);
};

const deleteUser = (userId) => {
    return axios.post(`http://localhost:2004/api/user/delete`, { id: userId });
};

const createUserDescription = (data) => {
    return axios.post(`http://localhost:2004/api/user-description/create`, data);
};

export const createHelpRequest = (data) => {
    console.log("Service sending data:", data);
    return axios.post(`http://localhost:2004/api/help-request/create`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};
export const getAllHelpRequests = () => {
    return axios.post(`http://localhost:2004/api/help-request/display`, {
    });
};

export { getAllCodes, createUser, getAllUsers, updateUser, deleteUser, createUserDescription, getUsersByPosition, getUsersByRole, getUserById, };
