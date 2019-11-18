import * as actionTypes from './actionTypes';

export function follow(data) {
    return {
        type: actionTypes.FOLLOW,
        data
    }
}

export function search(data) {
    return {
        type: actionTypes.SEARCH,
        data
    }
}

export function unfollow(data) {
    return {
        type: actionTypes.UNFOLLOW,
        data
    }
}

export function getUserData(data) {
    return {
        type: actionTypes.GET_USER_DATA,
        data
    }
}