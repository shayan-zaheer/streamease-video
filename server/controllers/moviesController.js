const executeQuery = require("../connection/execution");
const { BlobServiceClient } = require('@azure/storage-blob');

exports.getAllMovies = async (request, response) => {
    try{
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_CONN_STR);
        const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_BLOB_NAME);
        const blobName = "messi"; // Assuming the blob name is "messi.mp4"
        const videoUrl = `https://${process.env.AZURE_STORAGE_ACC}.blob.core.windows.net/${process.env.AZURE_BLOB_NAME}/${blobName}?sp=r&st=2024-05-13T20:15:01Z&se=2024-05-14T04:15:01Z&sv=2022-11-02&sr=b&sig=XnTTwQNSadam7%2FqAp1aPrGz15yODxTHrC66%2BdGiYI50%3D`;        

        const SQL = "SELECT * FROM MOVIES";
        const results = await executeQuery(SQL);

        results.forEach((movie) => {
            movie.videoUrl = videoUrl;
        });

        response.status(200).json({
            status: "success",
            movies: results
        });
    } catch (err) {
        response.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};
