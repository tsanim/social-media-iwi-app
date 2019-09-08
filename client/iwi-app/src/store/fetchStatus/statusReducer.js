import * as actionsTypes from './actionTypes';

export default function fetchStatus(oldState = 0, action) {
    switch (action.type) {
        case actionsTypes.FETCH_BEGIN:
            return oldState + 1;
        case actionsTypes.FETCH_ERROR:
        case actionsTypes.FETCH_DATA:
            return oldState - 1;
        default:
            return oldState
    }
}