import axios from 'axios';

async function axiosRequest(options, isOffline) {
    try {
        if (isOffline) {
            return options.onError({ message: 'Network error' });
        }

        const res = await axios({
            method: options.method,
            url: options.url,
            data: options.data ? options.data : null,
            headers: options.headers
        });

        const { data } = res;

        if (options.onSuccess) options.onSuccess(data);
    } catch (error) {
        //if there is arrray with errors in data - return them like or then return single data error object
        if (error.response) {
            options.onError(error.response.data.errors ? error.response.data.errors : error.response.data)
            console.log(error.response);
        }

        console.log(error.message);
    }
}

export default axiosRequest;