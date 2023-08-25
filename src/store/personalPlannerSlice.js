import { createSlice } from "@reduxjs/toolkit";

const personalPlannerSlice = createSlice({
    name: "personalPlanner",

    initialState: {
        activities: [],
    },

    reducers: {
        addActivity: (state, action) => {
            state.activities.push(action.payload);
        },
        removeActivity: (state, action) => {
            state.activities = state.activities.filter(
                activity => activity.activity_id !== action.payload.activity_id
            );
        },
    },
});

export const { addActivity, removeActivity } = personalPlannerSlice.actions;
export default personalPlannerSlice.reducer;
