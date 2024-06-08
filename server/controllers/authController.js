const jwt = require("jsonwebtoken");
const util = require("util");
const bcrypt = require("bcrypt");
const executeQuery = require("../connection/execution");

const signToken = email => {
    return jwt.sign({ email }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES,
    });
};

const compareHashPW = async (password, passwordDB) => {
    return await bcrypt.compare(password, passwordDB);
};

exports.signup = async (request, response) => {
    try {
        const { username, email, password } = request.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const SQL = "INSERT INTO USERS(username, email, password, registration_date) VALUES (?, ?, ?, CURDATE())";
        await executeQuery(SQL, [username, email, hashedPassword]);

        response.status(201).json({
            status: "success",
        });
    } catch (err) {
        response.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.login = async (request, response) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({
                status: "fail",
                message: "Please provide email ID & password for login!",
            });
        }

        const SQL = "SELECT * FROM USERS WHERE EMAIL = ?";
        const result = await executeQuery(SQL, [email]);

        if (!result[0] || !(await compareHashPW(password, result[0].password))) {
            return response.status(400).json({
                status: "fail",
                message: "Incorrect email or password!",
            });
        }

        const token = signToken(result[0].email);

        response.status(200).json({
            status: "success",
            token: token
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
        const testToken = request.headers.authorization;
        let token;
        if(testToken && testToken.startsWith("Bearer")){
            token = testToken.split(" ")[1];
        }

        if (!token) {
            return response.status(401).json({
                status: "fail",
                message: "You are not logged in!"
            });
        }

        // 2. verify/validate the token
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
        console.log(decodedToken);

        // 3. Check if the user exists
        const SQL = "SELECT * FROM USERS WHERE EMAIL = ?";
        const result = await executeQuery(SQL, [decodedToken.email]);

        if (!result) {
            return response.status(401).json({
                status: "fail",
                message: "The user with the given token does not exist!"
            });
        }

        // If everything is successful, user is authenticated
        // Proceed to the next middleware or handle the request
        next(); // Call next() to pass control to the next middleware
    } catch (err) {
        console.error(err);
        return response.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};
