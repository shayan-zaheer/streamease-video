const jwt = require("jsonwebtoken");
const util = require("util");
const bcrypt = require("bcrypt");
const executeQuery = require("../connection/execution");

const compareHashPW = async (password, passwordDB) => {
	return await bcrypt.compare(password, passwordDB);
};

exports.updateMe = async (request, response) => {
    try{
        
    }
    catch(err){

    }
}

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