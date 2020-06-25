import {runQuery} from "../../libs/mysql";
import {failure, json_success} from "../util/ResponseUtil";

//Generates SQL query (Returns surveys created by the current user)
const selectSurveyQuery = (cognitoId) => {
  return `SELECT s.*, (SELECT COUNT(*) FROM Results p WHERE p.surveyId = s.surveyId AND p.creatorId = '${cognitoId}' GROUP BY p.surveyId) as 'numResponses', `
    + `(SELECT COUNT(*) FROM Licenses l WHERE l.surveyId = s.surveyId) as 'numPurchases', `
    + `AVG(r.rating) AS 'avgRating' FROM Surveys s `
    + `LEFT JOIN Ratings r ON s.surveyId = r.surveyId WHERE s.userId = '${cognitoId}' GROUP BY s.surveyId`;
};

export async function main(event, context) {
  try {
    const results = await runQuery(selectSurveyQuery(event.requestContext.identity.cognitoIdentityId));
    return json_success(results);
  } catch (err) {
    console.error(err);
    return failure();
  }
}
