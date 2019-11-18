import axiosRequest from './axiosRequest'
import fetchRequest from './fetchRequest';
import * as fetchStatusActions from '../store/actions/fetchStatusActions/actionsCreator';

//make a converter func for options object

async function httpRequest(options, dispatch) {
    //check if fetch API is supported by the current browser (window object containt the fetch object)
    //on the other hand we return axios request
    const isOffline = window.navigator.onLine
    const userOnSucc = options.onSuccess;
    const userOnErr = options.onError;

    options.onSuccess = (data) => {
        if (dispatch) {
            dispatch(fetchStatusActions.fetchData());
        }

        if (options.onSuccess) {
            userOnSucc(data);
        }
    }

    options.onError = (data) => {
        if (dispatch) {
            dispatch(fetchStatusActions.errorFetch());
        }

        if (options.onError && userOnErr) {
            userOnErr(data);
        }
    }

    if (window.fetch) {
        return fetchRequest(options, isOffline);
    } else {
        return axiosRequest(options, isOffline);
    }
}

export default httpRequest;