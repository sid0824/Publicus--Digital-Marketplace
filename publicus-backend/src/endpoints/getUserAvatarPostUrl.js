import {failure, json_success} from "../util/ResponseUtil";
import {UploadBucket} from "../../config/ConfigValues";
import {runQuery} from "../../libs/mysql";
import uuidv1 from 'uuid/v1';
import {getSignedUrl} from "../util/QueryUtil";

// Query to save avatar image url
const addAvatarUrlQuery = (userId, avatar) => {
  return `UPDATE Users SET avatar = '${avatar}' WHERE userId = '${userId}'`;
};

export async function main(event, context) {
  try {
    const userId = event.requestContext.identity.cognitoIdentityId;
    const { fileType } = event.queryStringParameters;
    const filePath = `avatar/${uuidv1()}`;
    const putUrl = await getSignedUrl(filePath, fileType);
    const getUrl = `https://${UploadBucket}.s3.amazonaws.com/${filePath}`;
    await runQuery(addAvatarUrlQuery(userId, getUrl));
    return json_success({
      putUrl
    });
  } catch (err) {
    console.log(err);
    return failure();
  }
}