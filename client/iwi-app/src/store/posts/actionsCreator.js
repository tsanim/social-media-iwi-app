import * as actionTypes from './actionTypes';

export function commentPost(data) {
    return {
        type: actionTypes.COMMENT_POST,
        data
    }
}
export function deleteComment(data) {
    return {
        type: actionTypes.DELETE_COMMENT,
        data
    }
}

export function editComment(data) {
    return {
        type: actionTypes.EDIT_COMMENT,
        data
    }
}

export function getSubsPosts(data) {
    return {
        type: actionTypes.GET_USER_SUBS_POSTS,
        data
    }
}