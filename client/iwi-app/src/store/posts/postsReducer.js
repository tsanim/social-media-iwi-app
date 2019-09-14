import * as actionTypes from './actionTypes';

export default function posts(oldState = [], action) {
    let newState = [];
    switch (action.type) {
        case actionTypes.GET_USER_SUBS_POSTS:
            //check if action data is not undefined or is same like the old  
            if (action.data && (JSON.stringify(action.data) !== JSON.stringify(oldState))) {
                newState = [...oldState, ...action.data];
                console.log(newState);
                return newState;
            }

            return oldState
        case actionTypes.DELETE_COMMENT:
        case actionTypes.EDIT_COMMENT:
        case actionTypes.COMMENT_POST:
            const indexOfChangedPost = oldState.findIndex(obj => obj._id === action.data._id);

            if (indexOfChangedPost !== -1) {
                newState = [...oldState];

                newState[indexOfChangedPost] = action.data;
                return newState;
            }

            return oldState;

        default:
            return oldState;
    }
}