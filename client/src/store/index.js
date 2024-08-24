import {configureStore} from "@reduxjs/toolkit";
import movieSlice from "./movieSlice";
import statusSlice from "./statusSlice";

const store = configureStore({
    reducer: {
        movie: movieSlice.reducer,
        status: statusSlice.reducer   
    }
});

export default store;