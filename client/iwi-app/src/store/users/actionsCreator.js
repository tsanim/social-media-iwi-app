import * as actionTypes from './actionTypes';

export function search(data) {
    return {
        type: actionTypes.SEARCH,
        data
    }
}