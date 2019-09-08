import * as actionTypes from './actionTypes';

export default function posts(oldState = [], action) {
    let newState = {};
    switch (action.type) {
        case actionTypes.GET_USER_POSTS:
        case actionTypes.EDIT:
        case actionTypes.DELETE_POST:
            return action.data;
        case actionTypes.MAKE_POST:
            newState = [...oldState, action.data];
            return newState;
        case actionTypes.DELETE_COMMENT:
        case actionTypes.EDIT_COMMENT:
        case actionTypes.COMMENT_POST:
        case actionTypes.EDIT_POST:
            const indexOfChangedPost = oldState.findIndex(obj => obj._id === action.data._id);

            if (indexOfChangedPost !== -1) {
                newState = [...oldState];

                newState[indexOfChangedPost] = action.data;
                return newState;
            }

            return oldState;
        case actionTypes.RESET_POSTS:
            return []
        default:
            return oldState;
    }
}
