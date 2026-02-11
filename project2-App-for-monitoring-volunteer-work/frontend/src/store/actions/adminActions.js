import actionTypes from "./actionTypes";
import { getAllCodeService } from "../../services/userServices";
import { createUser } from "../../services/userServices";
import { getAllUsers } from "../../services/userServices";
import { deleteUser } from "../../services/userServices";
import { updateUser } from "../../services/userServices";
import { ExitStatus } from "typescript";
import { toast } from "react-toastify";
import { getTopDoctorsService } from "../../services/userServices";

// chuc vu
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("POSITION");
            // console.log("check res position", res);
            if (res && res.data.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data.data));
            } else {
                dispatch(fetchPositionFailed(res.data.errMessage));
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log("fetchPositionStart error", error);
        }
    };
};

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
});

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED,
});

// role
export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START });

            let res = await getAllCodeService("ROLE");
            if (res && res.data.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data.data));
            } else {
                dispatch(fetchRoleFailed(res.data.errMessage));
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log("fetchRoleStart error", error);
        }
    };
};

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
});

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
});
// gioi tinh
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START });

            let res = await getAllCodeService("GENDER");
            // console.log("check res gender", res);
            if (res && res.data.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data.data));
            } else {
                dispatch(fetchGenderFailed(res.data.errMessage));
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log("fetchGenderStart error", error);
        }
    };
};

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
});

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
});

// tạo user mới
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            if (data.image) {
                const base64Length =
                    data.image.length - (data.image.indexOf(",") + 1);
                const sizeInBytes = (base64Length * 3) / 4;
                const sizeInMB = sizeInBytes / (1024 * 1024);

                if (sizeInMB > 50) {
                    toast.error("Kích thước ảnh không được vượt quá 16MB");
                    return dispatch(createUserFailed());
                }
            }
            let res = await createUser(data);
            // console.log("check res gender", res);
            if (res && res.data.errCode === 0) {
                dispatch(createUserSuccess(res.data));
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(createUserFailed(res.data));
            }
        } catch (error) {
            if (error.response && error.response.status === 413) {
                toast.error(
                    "Kích thước ảnh quá lớn. Vui lòng thử lại với ảnh nhỏ hơn."
                );
            } else {
                toast.error("Lỗi tạo người dùng");
            }
            dispatch(createUserFailed());
            console.log("createUserFailed error", error);
        }
    };
};

export const createUserSuccess = (success) => {
    console.log("Success:", success); // Thực hiện kiểm tra ở đây
    return {
        type: actionTypes.CREATE_USER_SUCCESS,
        success: success,
    };
};

export const createUserFailed = (error) => {
    console.log("error:", error);
    return {
        type: actionTypes.CREATE_USER_FAILED,
        error: error,
    };
};

// hiển thị toàn bộ danh sách user

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_USERS_START });

            let res = await getAllUsers("ALL");
            if (res && res.data.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.data.users));
            } else {
                dispatch(fetchAllUsersFailed(res.data.errMessage));
            }
        } catch (error) {
            dispatch(fetchAllUsersFailed());
            console.log("fetchAllUsersStart error", error);
        }
    };
};

export const fetchAllUsersSuccess = (users) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: users,
});

export const fetchAllUsersFailed = (error) => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
    error: error,
});

// sửa thông tin người dùng

export const deleteUserStart = (userData) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUser(userData.id);
            if (res && res.data.errCode === 0) {
                toast.success(
                    `Xóa người dùng ${userData.lastName} ${userData.lastName} thành công`
                );
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Xóa người dùng không thành công");
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            toast.error("Xóa người dùng không thành công");
            dispatch(deleteUserFailed());
            console.log("deleteUser error", error);
        }
    };
};
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
});
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
});

export const editUserStart = (data) => {
    return async (dispatch, getState) => {
        try {
            console.log("Action received data:", data);
            let res = await updateUser(data);
            if (res && res.data.errCode === 0) {
                toast.success("Cập nhật thông tin thành công!");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error(res.data.errMessage);
                dispatch(editUserFailed());
            }
        } catch (error) {
            toast.error("Cập nhật thông tin thất bại!");
            dispatch(editUserFailed());
            console.log("editUserFailed error", error);
        }
    };
};

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
});

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
});

export const fetchAllDoctors = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_DOCTORS_START });

            const response = await getTopDoctorsService();
            console.log("API Response:", response);
            console.log("API Response.data:", response.data);

            if (response && response.data.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    doctors: response.data.data
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED
                });
            }
        } catch (error) {
            console.error('Fetch doctors error:', error);
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED
            });
        }
    };
};
