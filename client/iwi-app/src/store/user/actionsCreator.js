import * as actionTypes from './actionTypes';

export function follow(data) {
    return {
        type: actionTypes.FOLLOW,
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

export function commentPost(data) {
    return {
        type: actionTypes.COMMENT_USER_POST,
        data
    }
}

