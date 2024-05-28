const executeQuery = require("../connection/execution");
const {
	BlobServiceClient,
	StorageSharedKeyCredential,
	generateBlobSASQueryParameters,
	BlobSASPermissions,
} = require("@azure/storage-blob");

const accountName = process.env.AZURE_STORAGE_ACC;
const accountKey = process.env.AZURE_STORAGE_KEY;
const containerName = process.env.AZURE_BLOB_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(
	accountName,
	accountKey
);

const blobServiceClient = new BlobServiceClient(
	`https://${accountName}.blob.core.windows.net`,
	sharedKeyCredential
);

exports.getAllMovies = async (request, response) => {
	try{
		const SQL = "SELECT * FROM MOVIES";
		const results = await executeQuery(SQL);

		response.status(200).json({
			status: "success",
			movies: results,
		});
	} 
    catch(err){
		response.status(400).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.getMovieByID = async (request, response) => {
	try{
		const id = request.params.id;

		if (!id) {
			return response.status(400).json({
				status: "fail",
				message: "ID not provided!",
			});
		}

		const SQL = "SELECT * FROM MOVIES WHERE ID = ?";
		const results = await executeQuery(SQL, [id]);

		if (results.length === 0) {
			return response.status(404).json({
				status: "fail",
				message: "Movie not found!",
			});
		}

		const movieTitle = results[0].title.replace(/\s+/g, "").toLowerCase() + ".mkv";
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blobClient = containerClient.getBlobClient(movieTitle);

		const expiryDate = new Date();
		expiryDate.setMinutes(expiryDate.getMinutes() + 60);

		const sasToken = generateBlobSASQueryParameters(
			{
				containerName,
				blobName: movieTitle,
				permissions: BlobSASPermissions.parse("r"),
				startsOn: new Date(),
				expiresOn: expiryDate,
				protocol: "https",
				version: "2020-08-04",
			},
			sharedKeyCredential
		).toString();

		const videoUrl = `${blobClient.url}?${sasToken}`;
		results[0].url = videoUrl;

		response.status(200).json({
			status: "success",
			movie: results[0],
		});
	} 
    catch(err){
		response.status(500).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.searchMovie = async (request, response) => {
    try{
        const movie = request.params.query;
        const SQL = "SELECT * FROM MOVIES WHERE TITLE LIKE ?";
        const results = await executeQuery(SQL, [movie]);

        if (results.length === 0) {
			return response.status(404).json({
				status: "fail",
				message: "Movie not found!",
			});
		}
        
        response.status(200).json({
            status: "success",
            movies: results
        })
    }
    catch(err){
        response.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}
