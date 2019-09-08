import * as actionTypes from './actionTypes';

export function registerUser(data) {
    return {
        type: actionTypes.REGISTER,
        data
    }
}

export function loginUser(data) {
    return {
        type: actionTypes.LOGIN,
        data
    }
}

export function followUser(data) {
    return {
        type: actionTypes.FOLLOW_USER,
        data
    }
}

export function editInfo(data) {
    return {
        type: actionTypes.EDIT,
        data
    }
}

export function unfollowUser(data) {
    return {
        type: actionTypes.UNFOLLOW_USER,
        data
    }
}

export function logout() {
    return {
        type: actionTypes.LOGOUT,
    }
}