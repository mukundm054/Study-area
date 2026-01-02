import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Fetaure/Userslice";
import reducer from "../Fetaure/Userslice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
