const jwt = require("jsonwebtoken");
const util = require("util");
const upload = require("../utils/multer");
const multer = require("multer");
const bcrypt = require("bcrypt");
const executeQuery = require("../connection/execution");

const signToken = (email) => {
    return jwt.sign({ email }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES,
    });
};

exports.signup = async (request, response) => {
    try {
        upload.single('profileImage')(request, response, async err => {
            if (err instanceof multer.MulterError) {
                return response.status(400).json({
                    status: 'fail',
                    message: 'Error uploading file',
                    error: err.message
                });
            } else if (err) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Error uploading file',
                    error: err.message
                });
            }

            console.log(request);

            const { username, email, password } = request.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(request.file);
            
            const profileImageUrl = request.file ? request.file.path : null;

            const SQL =
                "INSERT INTO USERS(username, email, password, profile_image_url, registration_date) VALUES (?, ?, ?, ?, CURDATE())";
            await executeQuery(SQL, [username, email, hashedPassword, profileImageUrl]);

            response.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                data: {
                    username,
                    email,
                    profileImageUrl
                }
            });
        });
    } catch (err) {
        response.status(500).json({
            status: 'fail',
            message: 'Failed to register user',
            error: err.message
        });
    }
};

exports.login = async (request, response) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            console.log("Email or password not provided");
            return response.status(400).json({
                status: "fail",
                message: "Please provide email ID & password for login!",
            });
        }

        const SQL = "SELECT * FROM USERS WHERE EMAIL = ?";
        const result = await executeQuery(SQL, [email]);

        if (!result[0]) {
            console.log("User not found with provided email");
            return response.status(400).json({
                status: "fail",
                message: "Incorrect email or password!",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            result[0].password
        );

        if (!isPasswordCorrect) {
            return response.status(400).json({
                status: "fail",
                message: "Incorrect email or password!",
            });
        }

        const user_id = result[0].user_id;
        const token = signToken(result[0].email);

        console.log("Setting cookies and sending response");

        response.cookie("uid", user_id, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
            path: "/",
        });

        response.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
            path: "/",
        });

        response.status(200).json({
            status: "success",
        });
    } catch (err) {
        response.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.checkToken = async (request, response, next) => {
    try {
        const token = request.cookies.token;
        console.log(request.cookies);

        if (!token) {
            return response.status(401).json({
                status: "fail",
                message: "You are not logged in!",
            });
        }

        // 2. verify/validate the token
        const decodedToken = await util.promisify(jwt.verify)(
            token,
            process.env.SECRET_STR
        );
        console.log(decodedToken);

        // 3. Check if the user exists
        const SQL = "SELECT * FROM USERS WHERE EMAIL = ?";
        const result = await executeQuery(SQL, [decodedToken.email]);

        if (!result) {
            return response.status(401).json({
                status: "fail",
                message: "The user with the given token does not exist!",
            });
        }

        next();
    } catch (err) {
        console.error(err);
        return response.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.authenticate = async (request, response, next) => {
    try {
        const cookie = request.cookies.token;
        if (cookie) {
            response.json({
                authenticated: true,
            });
            next();
        } else {
            return response.json({
                authenticated: false,
            });
        }
    } catch (err) {
        return response.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.logout = async (request, response) => {
    try {
        response.clearCookie("token", {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        response.status(200).json({
            status: "success",
        });
    } catch (err) {
        response.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// const testToken = request.headers.authorization;
// let token;
// if(testToken && testToken.startsWith("Bearer")){
//     token = testToken.split(" ")[1];
// }
