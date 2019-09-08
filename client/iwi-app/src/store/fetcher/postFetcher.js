import * as postActions from '../posts/actionsCreator';
import * as userPostActions from '../userPosts/actionsCreator';
import * as fetchStatusActions from '../fetchStatus/actionsCreator';
import URI from '../../config/config';

export function uploadPost(postData) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/feed/posts/create`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
                body: postData
            });

            const data = await res.json();

            //if server response with error, dispatch it
            if (data.error) {
                dispatch(fetchStatusActions.errorFetch());
            } else {
                dispatch(fetchStatusActions.fetchData());
                dispatch(userPostActions.makePost(data.post));
            };
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function getUserPosts(userId) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/feed/posts/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                }
            });
            const data = await res.json();

            dispatch(userPostActions.getAllUsersPosts(data.posts));
            dispatch(fetchStatusActions.fetchData());
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function getAllSubsPosts() {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/feed/posts`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                }
            });
            const data = await res.json();

            dispatch(fetchStatusActions.fetchData());
            dispatch(postActions.getSubsPosts(data.posts));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function likePost(postId) {
    return async (dispatch) => {
        try {
            const res = await fetch(`${URI}/feed/posts/like/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();

            //chek if server response ERRORS
            if (data.errors.length > 0) dispatch(fetchStatusActions.errorFetch());
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function dislikePost(postId) {
    return async (dispatch) => {
        try {
            const res = await fetch(`${URI}/feed/posts/dislike/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();

            //chek if server response ERRORS
            if (data.errors.length > 0) dispatch(fetchStatusActions.errorFetch());
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function deletePost(postId) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/feed/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Api ' + localStorage.getItem('token')
                }
            });

            const data = await res.json();

            dispatch(fetchStatusActions.fetchData());
            dispatch(userPostActions.deletePost(data.posts));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function editPost(postData, postId) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/feed/posts/edit/${postId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Api ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await res.json();

            dispatch(fetchStatusActions.fetchData());
            dispatch(userPostActions.editPost(data.post));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}