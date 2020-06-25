const mysql = require('mysql');
import config from '../config';
import Stats from './stats';

export const Connection = mysql.createConnection(config.mysql);

Connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + Connection.threadId);
});


export default {
  Stats
}