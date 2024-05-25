const connection = require("../connection/database");

function executeQuery(sql, params){
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = executeQuery;
