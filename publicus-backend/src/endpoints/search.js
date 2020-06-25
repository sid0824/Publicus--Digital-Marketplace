import {runQuery} from "../../libs/mysql";
import {failure, json_success} from "../util/ResponseUtil";

//Generates SQL Query (Returns Survey, Number of comments on survey and average Rating
//from surveys where either the name or one of the tags match the search term,
//with pagination of 10 results per page)
const selectSearchQuery = (page, search) => {
  return `SELECT s.*, u.avatar, u.firstname, u.lastname, COUNT(c.commentId) AS 'numComments', AVG(r.rating) AS 'avgRating' 
           FROM Surveys s 
           LEFT JOIN Comments c ON s.surveyId = c.surveyId 
           LEFT JOIN Users u ON u.userId = s.userId 
           LEFT JOIN Ratings r ON s.surveyId = r.surveyId 
           WHERE s.publishedStatus = 3 AND ( 
              s.name = '${search}' OR s.userId = '${search}' OR s.surveyId IN (
                SELECT surveyId
                FROM Tags
                WHERE tag = '${search}'
              )
           ) GROUP BY s.surveyId 
           LIMIT 10 OFFSET ${(page - 1) * 10}`;
};

// Generates SQL Query (Returns Survey, Number of comments on survey and average Rating
// from all surveys, with pagination of 10 results per page)
const selectAllSurveysQuery = (page) => {
  return `SELECT s.*, u.avatar, u.firstname, u.lastname, COUNT(c.commentId) AS 'numComments', AVG(r.rating) AS 'avgRating' 
         FROM Surveys s 
         LEFT JOIN Comments c ON s.surveyId = c.surveyId 
         LEFT JOIN Users u ON u.userId = s.userId 
         LEFT JOIN Ratings r ON s.surveyId = r.surveyId 
         WHERE s.publishedStatus = 3
         GROUP BY s.surveyId 
         LIMIT 10 OFFSET ${(page - 1) * 10}`;
};

//Generates SQL Query (Returns a list of tags that a surveyId has)
const selectTagQuery = (surveyId) => {
  return `SELECT tag 
          FROM Tags
          WHERE surveyId = '${surveyId}'`;
};

export async function main(event, context) {
    try {
      //Parse Page number from queryString (default is 1)
      const page = (event.queryStringParameters && event.queryStringParameters.page && parseInt(event.queryStringParameters.page)) || 1;

      //Parse whether a search parameter was given
      const searchParameterGiven = (event.queryStringParameters && event.queryStringParameters.search);

      //Select which query to run based on whether a search parameter was given
      let query;
      if(searchParameterGiven) {
        query = selectSearchQuery(page, searchParameterGiven);
      } else {
        query = selectAllSurveysQuery(page);
      }

      const results = await runQuery(query);

      const withTags = await Promise.all(results.map(async(result) => {
        //Find the number of tags for each survey
        //Then append those tags to that survey result
        const tagSql = selectTagQuery(result.surveyId);
        const tags = await runQuery(tagSql);

        //Modify each survey result to also include a list of tags for that survey
        return {
          ...result,
          tags
        };
      }));
      return json_success(withTags);
    } catch (err) {
      console.error(err);
      return failure();
    }
}
