import * as actionTypes from './actionTypes';

export default function errors(oldState = [], action) {
    switch (action.type) {
        case actionTypes.ERROR:

            //chek if dispatched data is a single error or is array of errors
            if(Array.isArray(action.data)) {
                return action.data;
            } else {
                return [...oldState, action.data];
            }
        case actionTypes.RESET_ERRORS:
            return [];
        default:
            return oldState;
    }
}