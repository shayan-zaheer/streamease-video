require("dotenv").config({path: "./config.env"});
const express = require("express");
const cors = require("cors");
const app = express();
const moviesRoutes = require("./routes/moviesRoutes");
const authRoutes = require("./routes/authRoutes");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/movies", moviesRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;