const bcrypt = require("bcrypt");
const executeQuery = require("../connection/execution");

const compareHashPW = async (password, passwordDB) => {
	return await bcrypt.compare(password, passwordDB);
};

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