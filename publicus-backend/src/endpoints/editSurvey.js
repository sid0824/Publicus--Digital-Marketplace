import {failure, success} from "../util/ResponseUtil";
import {runQuery} from "../../libs/mysql";
import {deleteTagsBySurvey, insertTagsQuery} from "../util/QueryUtil";

// Update the existing form
const updateSurveyQuery = (surveyId, name, price, form, description, redirect, instructions) => {
  return `UPDATE Surveys 
          SET name = '${escape(name)}', price = ${price}, form = '${escape(JSON.stringify(form))}', 
           description = '${escape(description)}', redirect = '${escape(redirect)}', instructions = '${escape(instructions)}'
          WHERE surveyId = '${surveyId}'`;
};

export async function main(event, context) {
  try {
    const data = JSON.parse(event.body);

    // update form values
    await runQuery(updateSurveyQuery(data.surveyId, data.name, data.price, data.form, data.description, data.redirect, data.instructions));

    // delete existing tags
    await runQuery(deleteTagsBySurvey(data.surveyId));

    // insert new tags
    if (data.tags && data.tags.length) {
      await runQuery(insertTagsQuery(data.surveyId, data.tags));
    }
    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }
}