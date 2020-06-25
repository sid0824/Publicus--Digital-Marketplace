import {failure, success, unauthorised} from "../util/ResponseUtil";
import {runQuery} from "../../libs/mysql";
import {checkAdmin} from "../util/QueryUtil";

// Query to update the notifications status for a survey
const updateSurveyStatus = (surveyId, receiveNotifications) => {
  return `UPDATE Surveys 
          SET receiveNotifications = ${receiveNotifications}
          WHERE surveyId = '${surveyId}'`;
};

// Query to get the owner of a survey
const getOwnerBySurveyId = (surveyId) => {
  return `SELECT userId 
          FROM Surveys 
          WHERE surveyId = '${surveyId}'`;
};

export async function main(event, context) {
  try {
    const data = JSON.parse(event.body);
    const { receiveNotifications } = data;
    const { surveyId } = event.pathParameters;
    const thisUser = event.requestContext.identity.cognitoIdentityId;
    const isAdmin = await checkAdmin(event.requestContext.identity.cognitoIdentityId);
    const response = await runQuery(getOwnerBySurveyId(surveyId));
    const { userId } = response[0];
    if (!isAdmin && !(thisUser === userId)) {
      return unauthorised();
    }
    await runQuery(updateSurveyStatus(surveyId, receiveNotifications));
    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }
}