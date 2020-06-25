import AWS from 'aws-sdk';
import {AccessKeyId, SecretAccessKey} from "../config/ConfigValues";

export const s3 = new AWS.S3({
  region: 'ap-southeast-2',
  accessKeyId: AccessKeyId,
  secretAccessKey: SecretAccessKey
});

export const ses = new AWS.SES({
  region: 'us-west-2'
});