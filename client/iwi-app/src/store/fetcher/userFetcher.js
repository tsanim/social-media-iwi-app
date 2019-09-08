import * as userActions from '../user/actionsCreator';
import * as usersActions from '../users/actionsCreator';
import * as authActions from '../auth/actionsCreator';
import * as userPostsActions from '../userPosts/actionsCreator';
import * as fetchStatusActions from '../fetchStatus/actionsCreator';
import * as errorsActions from '../errors/actionsCreator';
import URI from '../../config/config';

export function searchUser({ searchText }) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/user/search?searchText=${searchText}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();

            dispatch(fetchStatusActions.fetchData());
            dispatch(usersActions.search(data));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function getUser(userId) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/user/info/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();

            dispatch(fetchStatusActions.fetchData());
            dispatch(userActions.getUserData(data.user));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function followUser(userId) {
    return async (dispatch) => {
        dispatch(fetchStatusActions.beginFetch());
        try {
            const res = await fetch(`${URI}/user/follow/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();

            dispatch(fetchStatusActions.fetchData());
            dispatch(authActions.followUser(data.me));
            dispatch(userActions.follow(data.user));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function unfollowUser(userId) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/user/unfollow/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Api ' + localStorage.getItem('token')
                },
            });

            const data = await res.json();
            dispatch(fetchStatusActions.fetchData());
            dispatch(userActions.unfollow(data.user));
            dispatch(authActions.unfollowUser(data.me));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
            console.log(error);
        }
    }
}

export function editUserInfo(userData) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/user/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Api ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await res.json();

            localStorage.setItem('username', data.user.username);

            dispatch(fetchStatusActions.fetchData());
            dispatch(authActions.editInfo(data.user));
            dispatch(userPostsActions.editUserInfo(data.user.posts));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
        }
    }
}

export function changeUserPic(userPic) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/user/changePic`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Api ' + localStorage.getItem('token'),
                },
                body: userPic
            });

            const data = await res.json();

            dispatch(fetchStatusActions.fetchData());
            dispatch(authActions.editInfo(data.user));
            dispatch(userPostsActions.editUserInfo(data.user.posts));
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
        }
    }
}

export function changePassword(passData) {
    return async (dispatch) => {
        try {
            dispatch(fetchStatusActions.beginFetch());
            const res = await fetch(`${URI}/user/changePassword`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Api ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passData)
            });

            const data = await res.json();
            console.log(data);

            if(data.error) {
                dispatch(errorsActions.fetchError([data]));
            } else {
                dispatch(fetchStatusActions.fetchData());
            }
        } catch (error) {
            dispatch(fetchStatusActions.errorFetch());
        }
    }
}