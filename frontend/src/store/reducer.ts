import { combineReducers } from "@reduxjs/toolkit";
import { usersReducer } from "features/users";
import { currentUserReducer } from "features/currentUser";

const rootReducer = combineReducers({
  users: usersReducer,
  currentUser: currentUserReducer,
});

export default rootReducer;
