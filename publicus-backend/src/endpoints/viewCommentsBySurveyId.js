import {runQuery} from "../../libs/mysql";
import {failure, json_success} from "../util/ResponseUtil";

//Generate SQL Query (Return comments with the surveyId)
const selectCommentsQuery = (surveyId) => {
  return `SELECT * 
          FROM Comments 
          WHERE surveyId = '${surveyId}'`;
};

export async function main(event, context) {
  try {
    const results = await runQuery(selectCommentsQuery(event.pathParameters.surveyId));
    return json_success(results);
  } catch (err) {
    console.error(err);
    return failure();
  }
}
