import { Link } from "react-router-dom";

function Header() {
	return (
		<header>
			<div className="nav container">
				<Link to="/home-page" className="logo">
					Stream<span>Ease</span>
				</Link>
				<div className="search-box">
					<input
						type="search"
						id="search-input"
						placeholder="Search movie"
					/>
					<i className="bx bx-search"></i>
					<div id="dropdown" className="dropdown-content"></div>
				</div>

				<Link to="/profile" className="user">
					<img alt="" className="user-img" />
				</Link>

				<div className="navbar">
					<Link to="/" className="nav-link nav-active">
						<i className="bx bx-home"></i>
						<span className="nav-link-title">Home</span>
					</Link>
					<Link to="/" className="nav-link">
						<i className="bx bxs-hot"></i>
						<span className="nav-link-title">Trending</span>
					</Link>
					<Link to="/" className="nav-link">
						<i className="bx bx-compass"></i>
						<span className="nav-link-title">Explore</span>
					</Link>
					<Link to="/" className="nav-link">
						<i className="bx bx-tv"></i>
						<span className="nav-link-title">Movies</span>
					</Link>
					<Link to="/" className="nav-link">
						<i className="bx bx-heart"></i>
						<span className="nav-link-title">Favorite</span>
					</Link>
				</div>
			</div>
		</header>
	);
}

export default Header;
