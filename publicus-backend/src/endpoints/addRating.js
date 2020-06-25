import {failure, success} from "../util/ResponseUtil";
import {runQuery} from "../../libs/mysql";

// Query to get a users current rating for a survey
const getExistingRatingQuery = (userId, surveyId) => {
  return `SELECT * FROM Ratings 
          WHERE userId = '${userId}' AND surveyId = '${surveyId}'`;
};

// Query to add a new rating for a user
const addNewRatingQuery = (userId, surveyId, newRating) => {
  return `INSERT INTO Ratings (userId, surveyId, rating)`
       + `VALUES ( '${userId}', '${surveyId}', ${newRating} )`;
};

// Query to update the rating for a user
const updateExistingRatingQuery = (userId, surveyId, newRating) => {
  return `UPDATE Ratings 
          SET rating = ${newRating} 
          WHERE userId = '${userId}' AND surveyId = '${surveyId}'`;
};

export async function main(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { surveyId } = event.pathParameters;
    const userId = event.requestContext.identity.cognitoIdentityId;

    // Get current rating
    const currentRating = await runQuery(getExistingRatingQuery(userId, surveyId));

    // Update if a rating exists
    if (currentRating.length) {
      await runQuery(updateExistingRatingQuery(userId, surveyId, body.rating));
    } else {
      // Add if a rating doesnt exist
      await runQuery(addNewRatingQuery(userId, surveyId, body.rating));
    }
    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }

}