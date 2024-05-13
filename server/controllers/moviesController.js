const executeQuery = require("../connection/execution");

exports.getAllMovies = async (request, response) => {
    try{
        const SQL = "SELECT * FROM MOVIES";
        const results = await executeQuery(SQL);

        response.status(200).json({
            status: "success",
            movies: results
        })
    }
    catch(err){
        response.status(400).json({
            status: "fail",
            message: err
        });
    }
}