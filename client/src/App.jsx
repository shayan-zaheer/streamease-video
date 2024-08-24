import { useSelector } from "react-redux";
import FetchMovies from "./components/FetchMovies";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import PopularMovies from "./components/PopularMovies";

function App() {
    const status = useSelector(store => store.status);
    
	return (
		<>
			<Header />
            <FetchMovies />
            {status.fetching ? <LoadingSpinner /> : <PopularMovies />}
		</>
	);
}

export default App;
