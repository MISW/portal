import { combineReducers } from "@reduxjs/toolkit";
import { usersReducer } from "features/users";
import { currentUserReducer } from "features/currentUser";
import { appconfigReducer } from "features/appconfig";

const rootReducer = combineReducers({
  users: usersReducer,
  currentUser: currentUserReducer,
  appconfig: appconfigReducer,
});

export default rootReducer;
