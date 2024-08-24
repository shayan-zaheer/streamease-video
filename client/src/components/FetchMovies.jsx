import { useDispatch, useSelector } from "react-redux";
import { statusActions } from "../store/statusSlice";
import { movieActions } from "../store/movieSlice";
import { useEffect } from "react";

function FetchMovies(){
    const status = useSelector(store => store.status);
    const dispatch = useDispatch();

    useEffect(() => {
        if(status.fetchDone) {
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        dispatch(statusActions.markFetchingStarted());

        fetch("http://localhost:8000/movies/popular", { signal })
        .then(res => res.json())
        .then((response) => {
            dispatch(statusActions.markFetchDone());
            dispatch(statusActions.markFetchingFinished());
            dispatch(movieActions.addMovies(response.movies));
        })
        .catch((error) => {
            dispatch(statusActions.markFetchingFinished());
        });
       
        return () => {
            controller.abort();
        };
    }, [status.fetchDone, dispatch]);

    return null;
};

export default FetchMovies;
