const mysql = require('mysql2');
const config = require('../../config/config');

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database
});

function query(sql, args) {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
}

async function close() {
    await pool.end()
}

module.exports = {
    query: query,
    close: close,
}
