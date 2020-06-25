import {runQuery} from "../../libs/mysql";
import {failure, json_success} from "../util/ResponseUtil";

//Generates SQL Query (returns surveys with a matching ID)
const selectSurveyQuery = (surveyId) => {
  return `SELECT *
          FROM Surveys
          WHERE surveyId = '${surveyId}'`;
};

//Generates SQL Query (Returns a list of tags that a surveyId has)
const selectTagQuery = (surveyId) => {
  return `SELECT tag 
          FROM Tags
          WHERE surveyId = '${surveyId}'`;
};

export async function main(event, context) {
  try {
    const results = await runQuery(selectSurveyQuery(event.pathParameters.surveyId));
    if (!results.length) {
      return failure();
    }
    const form = results[0];

    //Modify survey result to also include a list of tags for that survey
    const tagSql = selectTagQuery(form.surveyId);
    const tags = await runQuery(tagSql);

    return json_success({
      ...form,
      tags
    });
  } catch (err) {
    console.error(err);
    return failure();
  }
}
