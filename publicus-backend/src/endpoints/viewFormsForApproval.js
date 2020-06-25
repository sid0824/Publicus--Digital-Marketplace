import {runQuery} from "../../libs/mysql";
import {failure, json_success, unauthorised} from "../util/ResponseUtil";
import {checkAdmin} from "../util/QueryUtil";

const getToApproveQuery = () => {
  return `SELECT * FROM Surveys WHERE publishedStatus = 1`;
};

export async function main(event, context) {
  try {
    const isAdmin = await checkAdmin(event.requestContext.identity.cognitoIdentityId);
    if(!isAdmin) {
      return unauthorised();
    }
    const surveys = await runQuery(getToApproveQuery());
    return json_success(surveys);
  } catch (err) {
    console.log(err);
    return failure();
  }
}
