const connection = require("../connection/database");

function executeQuery(sql) {
	return new Promise((resolve, reject) => {
		connection.query(sql, (err, results) => {
			if(err){
				reject(err);
                console.log(err);
				return;
			}
			resolve(results);
		});
	});
};

module.exports = executeQuery;
