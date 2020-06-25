import {runQuery} from "../../libs/mysql";
import {failure, json_success, unauthorised} from "../util/ResponseUtil";
import {checkOwnerOrAdmin, checkOwnsForm} from "../util/QueryUtil";

//Generate SQL Query (return results for a particular survey if given user is the creator)
const selectResultsQuery = (surveyId, creatorId) => {
  return `SELECT * 
          FROM Results 
          WHERE surveyId = '${surveyId}' AND creatorId = '${creatorId}'`;
};

export async function main(event, context) {
  try {
    //Create mysql connection
    const userId = event.requestContext.identity.cognitoIdentityId;
    const { surveyId } = event.pathParameters;
    const valid = await checkOwnerOrAdmin(surveyId, userId) || await checkOwnsForm(userId, surveyId);
    if (!valid) {
      return unauthorised();
    }
    const results = await runQuery(selectResultsQuery(surveyId, userId));
    return json_success(results);
  } catch (err) {
    console.error(err);
    return failure();
  }
}
