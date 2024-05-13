const connection = require("../connection/database");

function executeQuery(sql){
	return new Promise((resolve, reject) => {
		connection.query(sql, (err, results) => {
			if(err){
				return reject(err);
			}
			resolve(results);
		});
	});
};

module.exports = executeQuery;
