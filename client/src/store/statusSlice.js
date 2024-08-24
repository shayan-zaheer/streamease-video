import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
	name: "status",
	initialState: {
        fetchDone: false,
        fetching: false
    },
	reducers: {
		markFetchDone: (state) => {
			state.fetchDone = true;
		},
        markFetchingStarted: (state) => {
            state.fetching = true;
        },
        markFetchingFinished: (state) => {
            state.fetching = false;
        }
	},
});

export const statusActions = statusSlice.actions;
export default statusSlice;
