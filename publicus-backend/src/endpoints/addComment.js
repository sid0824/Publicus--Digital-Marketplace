import {runQuery} from "../../libs/mysql";
import {failure, success} from "../util/ResponseUtil";

//Generate SQL query to insert comment (adds comments into database)
const insertCommentsQuery = (surveyId, userId, comment) => {
  return `INSERT INTO Comments (surveyId, userId, comment ) 
          VALUES ( '${surveyId}', '${userId}', '${comment}' )`;
};

export async function main(event, context) {
  try {
    //Retrieve body variables
    const data = JSON.parse(event.body);

    // Run add comment query
    await runQuery(insertCommentsQuery(event.pathParameters.surveyId,
      event.requestContext.identity.cognitoIdentityId, data.comment));

    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }
}
