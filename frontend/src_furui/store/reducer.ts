import { combineReducers } from "../src_furui/@reduxjs/toolkit";
import { usersReducer } from "../src_furui/features/users";
import { currentUserReducer } from "../src_furui/features/currentUser";
import { appconfigReducer } from "../src_furui/features/appconfig";

const rootReducer = combineReducers({
  users: usersReducer,
  currentUser: currentUserReducer,
  appconfig: appconfigReducer,
});

export default rootReducer;
