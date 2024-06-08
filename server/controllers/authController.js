const jwt = require("jsonwebtoken");
const util = require("util");
const crypto = require("crypto");
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
		const SQL =
			"INSERT INTO USERS(username, email, password, registration_date) VALUES (?, ?, ?, CURDATE())";
		const result = await executeQuery(SQL, [
			username,
			email,
			hashedPassword,
		]);

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

		console.log(result);

		if (!result || !(await compareHashPW(password, result.password))) {
			return response.status(400).json({
				status: "fail",
				message: "Incorrect email or password!",
			});
		}

		const token = signToken(result.email);

		const options = {
			maxAge: process.env.LOGIN_EXPIRES,
			httpOnly: true,
		};

		response.cookie("jwt", token, options);

		response.status(200).json({
			status: "success",
			token: token,
		});
	} catch (err) {
		response.status(500).json({
			status: "fail",
			message: err.message,
		});
	}
};

exports.checkToken = async (request, response) => {
    try{
        // 1. read the token and check if it exist
        const testToken = request.headers.authorization;
        let token;
        if(testToken && testToken.startsWith("Bearer")){
            token = testToken.split(" ")[1];
        }
        if(!token){
            next(new CustomError("You are not logged in!", 401));
        }
        
        // 2. verify/validate the token
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
        console.log(decodedToken)
        
        // 3. if the user exists
        const user = await User.findById({_id: decodedToken.id});
        if(!user){
            const error = new CustomError(`The user with given token does not exist!`, 401);
            next(error);
        }
    }
    catch(err){

    }
}