import {runQuery} from "../../libs/mysql";
import {failure, success} from "../util/ResponseUtil";

const defaultAvatar = 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png';

//Generate Insert SQL Query (adds new user to database)
const insertUserQuery = (userId, email, firstname, lastname) => {
  return `INSERT INTO Users (userId, email, avatar, firstname, lastname)
          VALUES ( '${userId}', '${email}', '${defaultAvatar}', '${firstname}', '${lastname}' )`;
};

export async function main(event, context) {
  try {
    //Retrieve body variables
    const data = JSON.parse(event.body);
    await runQuery(insertUserQuery(data.cognitoId, data.email, data.firstname, data.lastname));
    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }
}
