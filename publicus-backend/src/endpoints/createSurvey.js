import {runQuery} from "../../libs/mysql";
import {failure, success} from "../util/ResponseUtil";
import uuidv1 from 'uuid/v1';
import {insertTagsQuery} from "../util/QueryUtil";

const defaultImage = "https://designshack.net/wp-content/uploads/placeholder-image.png";

//Generate SQL query to insert Survey (adds new survey to database)
const insertSurveysQuery = (surveyId, userId, name, price, form, description, redirect, instructions) => {
  return `INSERT INTO Surveys (surveyId, userId, name, price, form, description, redirect, image, instructions) 
          VALUES( '${surveyId}', '${userId}', '${escape(name)}', ${price}, '${escape(form)}', '${escape(description)}', 
          '${escape(redirect)}', '${defaultImage}', '${escape(instructions)}' )`;
};

export async function main(event, context) {
  try {
    //Retrieve body variables
    const data = JSON.parse(event.body);
    const newSurveyId = uuidv1();

    // Add the survey to the database
    await runQuery(insertSurveysQuery(newSurveyId, event.requestContext.identity.cognitoIdentityId,
      data.name, data.price, JSON.stringify(data.form), data.description, data.redirect || '', data.instructions || ''));

    // Add the survey tags to the database
    if (data.tags && data.tags.length) {
      await runQuery(insertTagsQuery(newSurveyId, data.tags));
    }
    return success();
  } catch (err) {
    console.log(err);
    return failure();
  }

}
