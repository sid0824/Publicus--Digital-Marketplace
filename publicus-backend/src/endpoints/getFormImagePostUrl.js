import {failure, json_success} from "../util/ResponseUtil";
import {UploadBucket} from "../../config/ConfigValues";
import uuidv1 from 'uuid/v1';
import {runQuery} from "../../libs/mysql";
import {getSignedUrl} from "../util/QueryUtil";

// Add form image url to database
const addFormImageUrlQuery = (surveyId, image) => {
  return `UPDATE Surveys SET image = '${image}' WHERE surveyId = '${surveyId}'`;
};

export async function main(event, context) {
  try {
    const { fileType } = event.queryStringParameters;
    const { formId } = event.pathParameters;
    const filePath = `form/${uuidv1()}`;
    const putUrl = await getSignedUrl(filePath, fileType);
    const getUrl = `https://${UploadBucket}.s3.amazonaws.com/${filePath}`;
    await runQuery(addFormImageUrlQuery(formId, getUrl));
    return json_success({
      putUrl
    });
  } catch (err) {
    console.log(err);
    return failure();
  }
}