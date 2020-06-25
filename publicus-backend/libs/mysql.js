import mysql from 'mysql';
import {MySqlHost, MySqlPassword, MySqlUser} from "../config/ConfigValues";

//mysql connection to database
const connection = mysql.createConnection({
    host: MySqlHost,
    user: MySqlUser,
    password: MySqlPassword,
    database: "survey",
    multipleStatements: true
});

export const runQuery = async (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if(error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};