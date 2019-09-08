import * as actionTypes from './actionTypes';

export default function users(oldState = {}, action) {
    let newState = {};
    switch (action.type) {
        case actionTypes.FOLLOW:
        case actionTypes.UNFOLLOW:
            newState = Object.assign({}, oldState, action.data)
            return newState
        case actionTypes.GET_USER_DATA:
            newState = action.data;
            return newState;
        case actionTypes.COMMENT_USER_POST:
            newState = { ...oldState };

            const indexOfChangedPost = oldState.posts.findIndex(p => p._id === action.data._id);

            if (indexOfChangedPost !== -1) {
                newState.posts[indexOfChangedPost] = action.data;
                return newState;
            }

            return oldState;
        default:
            return oldState;
    }
}