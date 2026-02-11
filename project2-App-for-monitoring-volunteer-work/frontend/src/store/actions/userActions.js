import actionTypes from "./actionTypes";

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS,
});
export const userLoginSuccess = (userInforr) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInforr: userInforr,
});

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL,
});

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT,
});
