import * as actionTypes from './actionTypes';

export default function auth(oldState = {}, action) {
    let newState = {};
    switch (action.type) {
        case actionTypes.LOGIN:
        case actionTypes.REGISTER:
        case actionTypes.FOLLOW_USER:
        case actionTypes.UNFOLLOW_USER:
        case actionTypes.EDIT:
            newState = Object.assign({}, oldState, action.data)
            return newState
        case actionTypes.LOGOUT:
            newState = {};
            localStorage.clear();
            return newState;
        default:
            return oldState;
    }
}