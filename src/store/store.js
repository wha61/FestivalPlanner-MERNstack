import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import personalPlannerSlice from "./personalPlannerSlice";

const rootReducer = {
    user: userReducer,
    personalPlanner: personalPlannerSlice,
};

const store = configureStore({
    reducer: rootReducer,
});

export default store;
