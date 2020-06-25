import {runQuery} from "../../libs/mysql";
import {failure, success, unauthorised} from "../util/ResponseUtil";
import {checkAdmin} from "../util/QueryUtil";

//Generate Insert SQL Query (adds new user to database)
const updateUserToAdminQuery = (userId) => {
  return "UPDATE Users SET admin = 1 WHERE userId = '" + userId + "'";
};

// Query to users with specified email
const getUserIdQuery = (email) => {
  return `SELECT userId FROM Users WHERE email = '${email}'`;
};

export async function main(event, context) {
  try {
    //Retrieve body variables
    const data = JSON.parse(event.body);
    const isAdmin = await checkAdmin(event.requestContext.identity.cognitoIdentityId);
    if(!isAdmin) {
      return unauthorised();
    }
    const userData = await runQuery(getUserIdQuery(data.email));
    if (!userData || !userData.length) {
      return failure();
    }
    await runQuery(updateUserToAdminQuery(userData[0].userId));
    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }
}
