import * as authActions from '../auth/actionsCreator';
import * as errorsActions from '../errors/actionsCreator';
import URI from '../../config/config';

export function registerUser(userData) {
    return async (dispatch) => {
        try {
            const res = await fetch(`${URI}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const registerData = await res.json();

            //if server returns errors from express-validator - distpach them
            if (registerData.errors) {
                dispatch(errorsActions.fetchError(registerData.errors));
            } else {
                //after succesfully register - logged in user
                const res = await fetch(`${URI}/auth/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
    
                const data = await res.json();

                if(data.errors) {
                    dispatch(errorsActions.fetchError(data.errors));
                } else {
                    //set some of user info to local storage
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.user._id);
                    localStorage.setItem('role', data.user.roles);                
                    dispatch(authActions.registerUser(data.user));
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export function loginUser(userData) {
    return async (dispatch) => {
        try {
            const res = await fetch(`${URI}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await res.json();

            //check if server returns error about logging 
            if (data.error) {
                dispatch(errorsActions.fetchError(data));
            } else {
                //set some of user info to local storage
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userId', data.user._id);
                localStorage.setItem('role', data.user.roles);                
                localStorage.setItem('token', data.token);
                dispatch(authActions.loginUser(data.user));
            }
        } catch (error) {
            console.log(error);
        }
    }
}