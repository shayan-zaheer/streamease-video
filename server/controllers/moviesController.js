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
        const SQL = 'SELECT * FROM MOVIES WHERE SECTION = "General"';
        const results = await executeQuery(SQL);

        response.status(200).json({
            status: "success",
            movies: results,
        });
    }
    catch(err){
        response.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.getPopularMovies = async (request, response) => {
	try{
		const SQL = 'SELECT * FROM MOVIES WHERE SECTION = "Popular"';
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

exports.getMovieData = async (request, response) => {
    try{
        const {movieId} = request.params;
        const SQL = "SELECT * FROM MOVIES WHERE ID = ?";
        const result = await executeQuery(SQL, [movieId]);

        response.status(200).json({
            status: "success",
            result
        })
    }
    catch(err){
        response.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}

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

		if(results.length === 0) {
			return response.status(404).json({
				status: "fail",
				message: "Movie not found!",
			});
		}

		const movieTitle = results[0].title.replace(/\s+/g, "").toLowerCase() + ".mkv";
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blobClient = containerClient.getBlobClient(movieTitle);

		const expiryDate = new Date();
		expiryDate.setMinutes(expiryDate.getMinutes() + 200);

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

exports.searchMovies = async (request, response) => {
    const query = request.query.q;
    if(!query){
        return response.status(400).json({
            status: "fail",
            message: "No query parameters!"
        });
    }
    try{
        const SQL = "SELECT * FROM MOVIES WHERE title LIKE ?";
        const results = await executeQuery(SQL, [`${query}%`]);

        response.status(200).json({
            status: "success",
            movies: results
        });
    }
    catch(err){
        response.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

exports.addFavorite = async (request, response) => {
    try{
        const movieId = +request.params.movieId;
        const userId = +request.cookies.uid;

        console.log("movie: ", movieId, "\nuser: ", userId);
        const SQL = "INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)";
        const result = await executeQuery(SQL, [userId, movieId]);

        response.status(200).json({
            status: "success",
            user: userId,
            favorite: movieId
        });
    }
    catch(err){
        response.status(500).json({
            status: "fail",
            message: err.message
        })
    }
};


exports.updatePassword = async (request, response) => {
    try {
        console.log("REQUEST BODY:\n", request.body);
        const { oldPassword: oldPw, newPassword: newPw, confirmPassword: confirmPw } = request.body;
        const userId = request.cookies.uid;

        console.log("OldPw:", oldPw, "\nNewPw:", newPw, "\nConfirmPw:", confirmPw)
        console.log(request.body);  

        console.log(userId);

        const selectSQL = "SELECT password FROM USERS WHERE user_id = ?";
        const [user] = await executeQuery(selectSQL, [userId]);

        if (!user) {
            return response.status(400).json({
                status: "fail",
                message: "User not found."
            });
        }

        const oldHashedPw = user.password;
        const result = await compareHashPW(oldPw, oldHashedPw);

        if (result) {
            if (newPw === confirmPw) {
                const hashedPassword = await bcrypt.hash(newPw, 10);
                const updateSQL = "UPDATE USERS SET password = ? WHERE user_id = ?";
                await executeQuery(updateSQL, [hashedPassword, userId]);

                return response.status(200).json({
                    status: "success",
                    message: "Password updated successfully!"
                });
            } else {
                return response.status(400).json({
                    status: "fail",
                    message: "New Password and Confirm Password are not the same!"
                });
            }
        } else {
            return response.status(400).json({
                status: "fail",
                message: "Old Password is not correct. Try again!"
            });
        }
    } catch (err) {
        return response.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.getFavorites = async (request, response) => {
    try{
        const uid = +request.cookies.uid;
        const SQL = "SELECT movie_id FROM favorites WHERE user_id = ?";
        const result = await executeQuery(SQL, [uid]);

        response.status(200).json({
            status: "success",
            result
        })
    }
    catch(err){
        response.status(500).json({
            status: "fail",
            message: err.message
        })
    }
};

exports.removeFavorite = async (request, response) => {
    try{
        const {movieId} = request.params;
        const uid = request.cookies.uid;
        const SQL = "DELETE FROM favorites WHERE user_id = ? AND movie_id = ?";
        const result = await executeQuery(SQL, [uid, movieId]);

        response.status(204).json({
            status: "success"
        })
    }
    catch(err){
        response.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}
