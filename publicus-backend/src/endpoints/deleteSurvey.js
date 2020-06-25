import {failure, success, unauthorised} from "../util/ResponseUtil";
import {checkAdmin, checkOwner} from "../util/QueryUtil";
import {runQuery} from "../../libs/mysql";

const deleteTagsBySurvey = (surveyId) => {
  return `DELETE FROM Tags WHERE surveyId = '${surveyId}'`;
};

const deleteSurveyQuery = (surveyId) => {
  return `DELETE FROM Surveys WHERE surveyId = '${surveyId}'`;
};

const deleteResultsBySurvey = (surveyId) => {
  return `DELETE FROM Results WHERE surveyId = '${surveyId}'`;
};

export async function main(event, context) {
  try {
    const userId = event.requestContext.identity.cognitoIdentityId;
    const { surveyId } = event.pathParameters;
    const permissions = await Promise.all([checkAdmin(userId), checkOwner(surveyId, userId)]);
    if (!permissions[0] && !permissions[1]) {
      return unauthorised();
    }
    await runQuery(deleteResultsBySurvey(surveyId));
    await runQuery(deleteTagsBySurvey(surveyId));
    await runQuery(deleteSurveyQuery(surveyId));
    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }
}