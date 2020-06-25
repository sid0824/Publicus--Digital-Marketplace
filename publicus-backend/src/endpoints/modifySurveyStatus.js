import {runQuery} from "../../libs/mysql";
import {failure, success, unauthorised} from "../util/ResponseUtil";
import {checkAdmin, checkOwner, getUserNotificationSetting} from "../util/QueryUtil";
import {sendAcceptedEmail} from "../util/EmailUtil";

export const FormPublishedStates = {
  'NOT_SUBMITTED': 0,
  'SUBMITTED': 1,
  'REJECTED': 2,
  'PUBLISHED': 3
};

//Generate Insert SQL Query (adds new user to database)
const updateSurveyStatus = (status, surveyId) => {
  return `UPDATE Surveys 
          SET publishedStatus = ${status}
          WHERE surveyId = '${surveyId}'`;
};

// Query for fetching a survey by its id
const getFormDataByUserId = (surveyId) => {
  return `SELECT *
          FROM Surveys
          WHERE surveyId = '${surveyId}'`;
};

// Query for fetching email by userId
const getEmailById = (userId) => {
  return `SELECT email
          FROM Users
          WHERE userId = '${userId}'`;
};

export async function main(event, context) {
  try {
    //Retrieve body variables
    const data = JSON.parse(event.body);
    const { status } = data;
    const userId = event.requestContext.identity.cognitoIdentityId;

    // Only allow owners to make publish request
    if (status === FormPublishedStates.SUBMITTED) {
      const isOwner = await checkOwner(data.surveyId, userId);
      if (!isOwner) {
        return unauthorised();
      }
    }   // Only allow admins to reject and publish
    else if (status === FormPublishedStates.REJECTED || status === FormPublishedStates.PUBLISHED) {
      const isAdmin = await checkAdmin(userId);
      if (!isAdmin) {
        return unauthorised();
      }
    }

    await runQuery(updateSurveyStatus(status, data.surveyId));

    if (data.status === FormPublishedStates.PUBLISHED) {
      const userGetsNotifications = await getUserNotificationSetting(data.surveyId);
      if (userGetsNotifications) {
        const formData = await runQuery(getFormDataByUserId(data.surveyId));
        const emailData = await runQuery(getEmailById(formData[0].userId));
        await sendAcceptedEmail(emailData[0].email, formData[0]);
      }
    }
    return success();
  } catch (err) {
    console.log(err);
    return failure();
  }
}
