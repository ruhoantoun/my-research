import actionTypes from "../actions/actionTypes";

const initialState = {
    isLoggedIn: false,
    userInforr: null,
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInforr: action.userInforr,
            };
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInforr: null,
            };
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInforr: null,
            };
        default:
            return state;
    }
};

export default appReducer;
