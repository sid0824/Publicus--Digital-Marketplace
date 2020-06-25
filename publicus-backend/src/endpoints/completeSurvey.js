import {runQuery} from "../../libs/mysql";
import {failure, success} from "../util/ResponseUtil";

//Generate SQL query to insert Result (adds results from newly completed survey)
const insertResultsQuery = (surveyId, creatorId, results) => {
  return `INSERT INTO Results(surveyId, creatorId, results) 
          VALUES( '${surveyId}', '${creatorId}', '${results}' )`;
};

export async function main(event, context) {
  try {
    const data = JSON.parse(event.body);
    await runQuery(insertResultsQuery(event.pathParameters.surveyId, data.creatorId, escape(JSON.stringify(data.results))));
    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }
}
