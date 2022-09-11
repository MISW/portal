import { combineReducers } from '@reduxjs/toolkit';
import { usersReducer } from 'features/users';
import { currentUserReducer } from 'features/currentUser';
import { appconfigReducer } from 'features/appconfig';
import { currentOidcAccountReducer as currentOidcAccountInfoReducer } from 'features/currentOidcAccount/slice';

const rootReducer = combineReducers({
  users: usersReducer,
  currentOidcAccountInfo: currentOidcAccountInfoReducer,
  currentUser: currentUserReducer,
  appconfig: appconfigReducer,
});

export default rootReducer;
