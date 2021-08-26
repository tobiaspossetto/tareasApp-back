


const mysql = require('mysql');

//modulo para poder usar promesas(packete de mysql en node no las soporta)
const {promisify} = require('util');



const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Salmo.83',
    database: 'tareasapp'
})


pool.getConnection((err, connection) => {
    if(err){
        if(err.code === "PROTOCOL_CONNECTION_LOST"){
            console.error('DATABASE CONNECTION WAS CLOSED')
        }
        if(err.code === "ER_CON_COUNT_ERROR"){
            console.error('DATABASE HAS TO MANY CONNECTIONS')
        }
        if(err.code === "ECONNREFUSED"){
            console.error('DATABASE CONNECTION WAS REFUSED')
        }
    }
    if(connection) connection.release();
    console.log('DB is Connected');
    return;
})

// Promisify pool querys, convirtiendo a promesas
pool.query = promisify(pool.query);
module.exports = pool;