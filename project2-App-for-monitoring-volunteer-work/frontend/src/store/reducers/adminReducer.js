import actionTypes from "../actions/actionTypes";

const initialState = {
    isLoading: false,
    genders: [],
    roles: [],
    positions: [],
    error: [],
    success: [],
    users: [],
    isLoadingUsers: false,
    userError: null,
    allDoctors: [],
};

const adminReducer = (state = initialState, action) => {
    // Ghi log một lần bên ngoài switch

    switch (action.type) {
        // loadGender
        case actionTypes.FETCH_GENDER_START:
            return {
                ...state,
                isLoading: true,
            };

        case actionTypes.FETCH_GENDER_SUCCESS:
            return {
                ...state,
                genders: action.data,
                isLoading: false,
            };

        case actionTypes.FETCH_GENDER_FAILED:
            return {
                ...state,
                isLoading: false,
                genders: [],
            };

        // loadposition
        case actionTypes.FETCH_POSITION_START:
            return {
                ...state,
                isLoading: true,
            };
        case actionTypes.FETCH_POSITION_SUCCESS:
            return {
                ...state,
                positions: action.data,
                isLoading: false,
            };
        case actionTypes.FETCH_POSITION_FAILED:
            return {
                ...state,
                isLoading: false,
            };

        case actionTypes.FETCH_ROLE_START: // Thêm trường hợp FETCH_ROLE_START
            return {
                ...state,
                isLoading: true,
            };
        case actionTypes.FETCH_ROLE_SUCCESS: // Thêm trường hợp FETCH_ROLE_SUCCESS
            return {
                ...state,
                roles: action.data,
                isLoading: false,
            };
        case actionTypes.FETCH_ROLE_FAILED: // Thêm trường hợp FETCH_ROLE_FAILED
            return {
                ...state,
                isLoading: false,
            };

        case actionTypes.CREATE_USER_SUCCESS:
            console.log("check acction", action.success);
            return {
                ...state,
                isLoading: false,
                success: action.success,
                error: [],
            };
        case actionTypes.CREATE_USER_FAILED:
            console.log("check acction", action.error);
            return {
                ...state,
                isLoading: false,
                error: action.error,
                success: [],
            };

        // case hiển thị user
        case actionTypes.FETCH_ALL_USERS_START:
            return {
                ...state,
                isLoadingUsers: true,
            };

        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.users,
                isLoadingUsers: false,
                userError: null,
            };

        case actionTypes.FETCH_ALL_USERS_FAILED:
            return {
                ...state,
                isLoadingUsers: false,
                users: [],
                userError: action.error || "Có lỗi xảy ra",
            };
        case actionTypes.DELETE_USER_SUCCESS:
            return {
                ...state,
                error: [],
            };
        case actionTypes.DELETE_USER_FAILED:
            return {
                ...state,
                // error: action.error,
            };

            case actionTypes.FETCH_ALL_DOCTORS_START:
                return {
                    ...state,
                    isLoading: true
                };
            case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
                return {
                    ...state,
                    allDoctors: action.doctors,
                    isLoading: false
                };
            case actionTypes.FETCH_ALL_DOCTORS_FAILED:
                return {
                    ...state,
                    isLoading: false,
                    error: 'Failed to fetch doctors'
                };
        default:
            return state;
    }
};

export default adminReducer;
