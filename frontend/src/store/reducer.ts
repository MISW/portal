import { combineReducers } from "@reduxjs/toolkit";
import { usersReducer } from "./users";
import { currentUserReducer } from "./currentUser";

const rootReducer = combineReducers({
  users: usersReducer,
  currentUser: currentUserReducer,
});

export default rootReducer;
