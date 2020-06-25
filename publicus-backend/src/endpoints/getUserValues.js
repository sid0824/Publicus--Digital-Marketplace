import {failure, json_success} from "../util/ResponseUtil";
import {runQuery} from "../../libs/mysql";
import {getUserValuesById} from "../util/QueryUtil";

export async function main(event, context) {
  try {
    const { cognitoIdentityId } = event.requestContext.identity;
    const userData = await runQuery(getUserValuesById(cognitoIdentityId));
    return json_success(userData[0]);
  } catch (err) {
    console.log(err);
    return failure();
  }
}