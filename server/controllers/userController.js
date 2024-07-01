const executeQuery = require("../connection/execution");

exports.getUser = async (request, response) => {
    try{
        const uid = request.cookies.uid;
        const SQL = "SELECT first_name, last_name, username, email, profile_image_url from USERS where user_id = ?";
        const result = await executeQuery(SQL, [uid]);

        response.status(200).json({
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

exports.updateProfile = async (request, response) => {
    try{
        const { firstName, lastName, username, email } = request.body;
        const uid = request.cookies.uid;

        console.log(request.body);

        const SQL = "UPDATE USERS SET first_name = ?, last_name = ?, username = ?, email = ? WHERE user_id = ?";
        const result = await executeQuery(SQL, [firstName, lastName, username, email, uid]);

        if(result.affectedRows === 0) {
            return response.status(400).json({
                status: 'fail',
                message: 'Failed to update profile, user not found',
            });
        }

        response.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
        });
    } 
    catch(err){
        response.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};