import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import auth from './auth/authReducer';
import posts from './posts/postsReducer';
import userPosts from './userPosts/userPostsReducer';
import users from './users/usersReducer';
import errors from './errors/errorsReducer';
import user from './user/userReducer';
import fetchStatus from './fetchStatus/statusReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['auth', 'userPosts']
}

const myPersistReducer = persistReducer(persistConfig, combineReducers({ auth, userPosts, users, user, posts, fetchStatus, errors }));

export default () => {
    let store = createStore(myPersistReducer, applyMiddleware(thunk));
    let persistor = persistStore(store);

    return { store, persistor }
} 
