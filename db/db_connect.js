const mysql2 = require('mysql2');
const dbconnect = mysql2.createConnection( {
    host:'localhost',
    user:'cspower',
    password:'P@ssW0rd12',
    database:'cms'
});

module.exports = dbconnect;