import { Link } from "react-router-dom";

function Movie({movie}) {
	return (
		<div className="movie-box">
			<img src={movie.v_poster} alt={movie.title} className="movie-box-img" />
			<div className="box-text">
				<h2 className="movie-title">{movie.title}</h2>
				<span className="movie-type">{movie.genre}</span>
				<Link to={`play-page?id=${movie.id}`}
					className="watch-btn play-btn"
					data-id={movie.id}
				>
					<i className="bx bx-right-arrow"></i>
				</Link>
				<a className="watch-btn heart-btn" data-id={movie.id}>
					<i className="bx bxs-heart" style={{color:"#ffffff"}}></i>
				</a>
			</div>
		</div>
	);
}

export default Movie;
