import {runQuery} from "../../libs/mysql";
import {failure, json_success} from "../util/ResponseUtil";

//Generate SQL Query (Returns surveys that the user has purchased)
const selectPurchasedSurveyQuery = (cognitoId) => {
  return `SELECT s.*, (SELECT COUNT(*) FROM Results p WHERE p.surveyId = s.surveyId AND p.creatorId = '${cognitoId}' GROUP BY p.surveyId) as 'numResponses', `
    + `(SELECT AVG(r.rating) FROM Ratings r WHERE r.surveyId = s.surveyId AND r.userId = '${cognitoId}' GROUP BY r.surveyId) as 'myRating' `
    + `FROM Surveys s WHERE s.surveyId In `
    + "(SELECT surveyId FROM Licenses WHERE userId = '" + cognitoId + "' )";
};

export async function main(event, context) {
  try {
    const results = await runQuery(selectPurchasedSurveyQuery(event.requestContext.identity.cognitoIdentityId));
    return json_success(results);
  } catch (err) {
   console.error(err);
   return failure();
  }
}
