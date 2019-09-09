import * as postActions from '../posts/actionsCreator';
import * as userActions from '../user/actionsCreator';
import * as fetchStatusActions from '../fetchStatus/actionsCreator';
import * as userPostActions from '../userPosts/actionsCreator';
import URI from '../../config/config';

export function makeComment(commentData) {
    return async (dispatch) => {
        try {
            //make post req to create a comment than get commen data by res
            const res = await fetch(`${URI}/feed/comments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
                body: JSON.stringify(commentData),
            });

            const data = await res.json();

            dispatch(userPostActions.commentPost(data.post));
            dispatch(postActions.commentPost(data.post));
            dispatch(userActions.commentPost(data.post));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function likeComment(commentId) {
    return async (dispatch) => {
        try {
            //make a put req to change comment from unliked to liked
            const res = await fetch(`${URI}/feed/comments/like/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();

            //chek if server response ERRORS
            if(data.errors.length > 0) dispatch(fetchStatusActions.errorFetch());
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function dislikeComment(commentId) {
    return async (dispatch) => {
        try {
            //make a put req to change comment from liked to unliked
            const res = await fetch(`${URI}/feed/comments/dislike/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();

            //chek if server response ERRORS
            if(data.errors.length > 0) dispatch(fetchStatusActions.errorFetch());
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function deleteComment(commentId) {
    return async (dispatch) => {
        try {
            //make a delete req 
            const res = await fetch(`${URI}/feed/comments/delete/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();

            dispatch({type: 'DELETE_COMMENT', data: data.post});
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function editComment(commentData, commentId) {
    return async (dispatch) => {
        try {
            const res = await fetch(`${URI}/feed/comments/edit/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
                body: JSON.stringify(commentData)
            });

            const data = await res.json();

            dispatch({type: 'EDIT_COMMENT', data: data.post});
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}