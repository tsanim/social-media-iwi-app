import * as actionTypes from './actionTypes';

export default function users(oldState = [], action) {
    let newState = [];
    switch (action.type) {
        case actionTypes.SEARCH:
            newState = action.data;
            return newState;
        default:
            return oldState;
    }
}