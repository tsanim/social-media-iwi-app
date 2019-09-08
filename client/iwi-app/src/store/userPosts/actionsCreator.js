import * as actionTypes from './actionTypes';

export function makePost(data) {
    return {
        type: actionTypes.MAKE_POST,
        data
    }
}

export function deletePost(data) {
    return {
        type: actionTypes.DELETE_POST,
        data
    }
}

export function deleteComment(data) {
    return {
        type: actionTypes.DELETE_COMMENT,
        data
    }
}

export function editPost(data) {
    return {
        type: actionTypes.EDIT_POST,
        data
    }
}

export function resetPosts() {
    return {
        type: actionTypes.RESET_POSTS,
    }
}

export function editUserInfo(data) {
    return {
        type: actionTypes.EDIT,
        data
    }
}

export function editComment(data) {
    return {
        type: actionTypes.EDIT_COMMENT,
        data
    }
}


export function getAllUsersPosts(data) {
    return {
        type: actionTypes.GET_USER_POSTS,
        data
    }
}

export function commentPost(data) {
    return {
        type: actionTypes.COMMENT_POST,
        data
    }
}