require("dotenv").config({path: "./config.env"});
const express = require("express");
const cors = require("cors");
const app = express();
const moviesRoutes = require("./routes/moviesRoutes");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));
app.use("/movies", moviesRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;