import * as authActions from '../store/actions/authActions/actionsCreator';
import * as errorsActions from '../store/actions/errorsActions/actionsCreator';
import URI from '../config/config';

import httpRequest from '../utils/httpRequest';

export function registerUser(userData) {
    return (dispatch) => {
        const onError = (errors) => {
            dispatch(errorsActions.fetchError(errors));
        };

        const onRegisterSuccess = (data) => {
            const optionsSignInReq = {
                method: 'post',
                url: `${URI}/auth/signin`,
                data: userData,
                headers: {
                    'Content-Type': 'application/json',
                },
                onSuccess: (data) => {
                    const { token, user } = data;

                    //set some of user info to local storage
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('token', token);
                    localStorage.setItem('userId', user._id);
                    localStorage.setItem('role', user.roles);
                    dispatch(authActions.registerUser(user));
                },
                onError
            }

            httpRequest(optionsSignInReq);
        }


        const optionsReq = {
            method: 'post',
            url: `${URI}/auth/signup`,
            data: userData,
            headers: {
                'Content-Type': 'application/json',
            },
            onSuccess: onRegisterSuccess,
            onError
        }

        httpRequest(optionsReq, dispatch);
    }
}

export function loginUser(userData) {
    return (dispatch) => {
        const onError = (errors) => {
            dispatch(errorsActions.fetchError(errors));
        };

        const optionsReq = {
            method: 'post',
            url: `${URI}/auth/signin`,
            data: userData,
            headers: {
                'Content-Type': 'application/json',
            },
            onSuccess: (data) => {
                const { token, user } = data;

                //set some of user info to local storage
                localStorage.setItem('username', user.username);
                localStorage.setItem('token', token);
                localStorage.setItem('userId', user._id);
                localStorage.setItem('role', user.roles);
                dispatch(authActions.registerUser(user));
            },
            onError
        }

        httpRequest(optionsReq, dispatch);
    }
}
