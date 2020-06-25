import {runQuery} from "../../libs/mysql";
import {UploadBucket} from "../../config/ConfigValues";
import {s3} from "../../libs/Aws";

const getUserNotificationSettingQuery = (surveyId) => {
  return `SELECT receiveNotifications
          FROM Surveys
          WHERE surveyId = '${surveyId}'`;
};

export const getUserNotificationSetting = async (surveyId) => {
  const response = await runQuery(getUserNotificationSettingQuery(surveyId));
  return response[0].receiveNotifications;
};

const checkAdminQuery = (userId) => {
  return `SELECT admin 
          FROM Users 
          WHERE userId = '${userId}'`;
};

export async function checkAdmin(userId) {
  const response = await runQuery(checkAdminQuery(userId));
  return response.length && response[0].admin === 1;
}

const getSurveyOwnerQuery = (surveyId) => {
  return `SELECT userId 
          FROM Surveys 
          WHERE surveyId = '${surveyId}'`;
};

export async function checkOwner(surveyId, userId) {
  const response = await runQuery(getSurveyOwnerQuery(surveyId));
  return response.length && response[0].userId === userId;
}

export const checkOwnerOrAdmin = async (surveyId, userId) => {
  const isOwner = await checkOwner(surveyId, userId);
  if (isOwner) {
    return true;
  }
  return checkAdmin(userId);
};

export const getSignedUrl = async (filePath, fileType) => {
  const s3Params = {
    Bucket: UploadBucket,
    Key: filePath,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read'
  };
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        reject();
      }
      resolve(data);
    });
  });
};

//Generate an insert value for each tag added
export const insertTagsQuery = (surveyId, tags) => {
  let sql = "INSERT INTO Tags(surveyId, tag) VALUES ";
  for(let i = 0; i < tags.length; i++) {
    sql = sql + "( '" + surveyId + "', '" + escape(tags[i]) + "')";
    if(i < tags.length - 1) {
      sql = sql + ",";
    } else {
      sql = sql + ";";
    }
  }
  return sql;
};

export const deleteTagsBySurvey = (surveyId) => {
  return `DELETE FROM Tags WHERE surveyId = '${surveyId}'`;
};

export const getUserValuesById = (userId) => {
  return `SELECT * 
          FROM Users
          WHERE userId = '${userId}'`;
};

const checkOwnsFormQuery = (userId, surveyId) => {
  return `SELECT * 
          FROM Licenses
          WHERE userId = '${userId}' AND surveyId = '${surveyId}'`;
};

export const checkOwnsForm = async (userId, surveyId) => {
  const result = await runQuery(checkOwnsFormQuery(userId, surveyId));
  return result.length;
};
