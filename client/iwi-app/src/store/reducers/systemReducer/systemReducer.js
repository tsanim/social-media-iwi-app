import * as authActionTypes from '../../actions/authActions/actionTypes';
import * as connStatusTypes from '../../actions/connectionStatusActions/actionTypes';
import * as fetchStatusTypes from '../../actions/fetchStatusActions/actionTypes';

import { fromJS } from 'immutable';

export const initState = fromJS({
    curUser: {},
    connectionStatus: true,
    fetchStatus: 0,
});

export default function system(oldState = initState, action) {
    switch (action.type) {
        case authActionTypes.REGISTER:
        case authActionTypes.FOLLOW_USER:
        case authActionTypes.UNFOLLOW_USER:
        case authActionTypes.EDIT:
            return oldState.set('curUser', fromJS(action.data));
        case authActionTypes.LOGOUT:
            localStorage.clear();
            return initState;
        case connStatusTypes.ONLINE:
            return oldState.set('connectionStatus', true);
        case connStatusTypes.OFFLINE:
            return oldState.set('connectionStatus', true);;
        case fetchStatusTypes.FETCH_BEGIN:
            return oldState.set('fetchStatus', oldState.get('fetchStatus') + 1);
        case fetchStatusTypes.FETCH_ERROR:
            return oldState.set('fetchStatus', oldState.get('fetchStatus') - 1);
        case fetchStatusTypes.FETCH_DATA:
            return oldState.set('fetchStatus', oldState.get('fetchStatus') - 1);
        default:
            return oldState;
    }
}