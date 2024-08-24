import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
    name: "movie",
    initialState: [],
    reducers: {
        addMovies: (state, action) => {
            return action.payload;
        }
    }
});

export const movieActions = movieSlice.actions;
export default movieSlice;
