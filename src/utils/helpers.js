export const stateConditionString = state => {
    let navigateTo = '';
    if (state.isLoading) {
        navigateTo = 'LOAD_LOADING';
    } else if (state.isNotSignedIn) {
        navigateTo = 'LOAD_SIGNIN';
    } else if (state.isLoggedIn) {
        navigateTo = 'LOAD_APP';
    } else if (state.isNotSignedUp) {
        navigateTo = 'LOAD_SIGNUP';
    } else if (state.isForgotPassword) {
        navigateTo = 'LOAD_FORGOT_PASSWORD';
    } else if (state.verifySMS) {
        navigateTo = 'LOAD_VERIFY_SMS';
    } else if (state.isMissingPersonalInfo) {
        navigateTo = 'LOAD_UPDATE_PERSONAL_INFO';
    }
    return navigateTo;
};

export const reducer = (prevState, action) => {
    switch (action.type) {
        case 'TO_SIGNUP_PAGE': //LOAD_SIGNUP
            return {
                ...prevState,
                isNotSignedUp: true,
                isNotSignedIn: false,
            };
        case 'TO_SIGNIN_PAGE': //LOAD_SIGNIN
            return {
                ...prevState,
                isNotSignedIn: true,
                isNotSignedUp: false,
                verifySMS: false,
                isForgotPassword: false,
                userRoot: null
            };
        case 'TO_VERIFY_SMS_PAGE': //LOAD_VERIFY_SMS
            return {
                ...prevState,
                verifySMS: true,
                isNotSignedUp: false,
                isForgotPassword: false,
                userRoot: action.userRoot,
            };
        case 'RESTORE_TOKEN': //LOAD_SIGNIN
            return {
                ...prevState,
                userRoot: action.userRoot,
                isLoading: false,
            };
        case 'SIGN_IN': //LOAD_APP
            return {
                ...prevState,
                isLoggedIn: true,
                isNotSignedUp: false,
                isNotSignedIn: false,
                isMissingPersonalInfo: false,
                userRoot: action.userRoot.data,
            };
        case 'SIGN_OUT': //LOAD_SIGNIN
            return {
                ...prevState,
                isLoggedIn: false,
                isLoading: false,
                userRoot: null
            };
        case 'TO_FORGOT_PASS_PAGE': //LOAD_FORGOT_PASSWORD
            return {
                ...prevState,
                isForgotPassword: true,
                isNotSignedIn: false,
            };
        case 'TO_UPDATE_PERSONAL_INFO_PAGE': //LOAD_UPDATE_PERSONAL_INFO
            return {
                ...prevState,
                isMissingPersonalInfo: true,
                isNotSignedIn: false,
                userRoot: action.userRoot.data
            };
    }
};

export const initialState = {
    isLoading: true,
    isNotSignedIn: false,
    isLoggedIn: false,
    isNotSignedUp: false,
    isForgotPassword: false,
    verifySMS: false,
    isMissingPersonalInfo: false,
    userRoot: null
};
