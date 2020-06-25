import { s3 } from "../../../libs/Aws";
import {
  checkAdmin,
  checkOwner,
  checkOwnerOrAdmin,
  checkOwnsForm,
  getSignedUrl,
  getUserNotificationSetting
} from "../QueryUtil";
import {runQuery} from "../../../libs/mysql";

jest.mock('../../../libs/Aws');
jest.mock("../../../libs/mysql");

describe('QueryUtil', () => {

  test(`should return receive notification setting`, async () => {
    runQuery.mockResolvedValueOnce([{ receiveNotifications: 1 }]);
    expect(runQuery.mock.calls[0]).toMatchSnapshot();
    expect(await getUserNotificationSetting('SURVEY_ID')).toEqual(1);
  });

  test(`should return if owner`, async () => {
    runQuery.mockResolvedValueOnce([{ userId: 'USER_ID' }]);
    expect(runQuery.mock.calls[0]).toMatchSnapshot();
    expect(await checkOwner('SURVEY_ID', 'USER_ID')).toBeTruthy();
  });

  test(`should return if admin`, async () => {
    runQuery.mockResolvedValueOnce([{ admin: 1 }]);
    expect(runQuery.mock.calls[0]).toMatchSnapshot();
    expect(await checkAdmin('USER_ID')).toBeTruthy();
  });

  test(`should return if owner or admin`, async () => {
    runQuery
      .mockResolvedValueOnce([{ userId: null }])
      .mockResolvedValueOnce([{ admin: 1 }]);
    expect(runQuery.mock.calls[0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1]).toMatchSnapshot();
    expect(await checkOwnerOrAdmin('SURVEY_ID', 'USER_ID')).toBeTruthy();
  });

  test(`should get image s3 pre-signed url`, async () => {
    s3.getSignedUrl.mockImplementation((action, params, callback) => callback(null, 'http://signedurl.com'));
    const data = await getSignedUrl('FILE_PATH', 'FILE_TYPE');
    expect(data).toEqual('http://signedurl.com');
    expect(s3.getSignedUrl.mock.calls[0]).toMatchSnapshot();
  });

  test(`should return if a user owns a form`, async () => {
    runQuery.mockResolvedValueOnce([{ MOCK: 'VALUE' }]);
    const owns = await checkOwnsForm('USER_ID', 'SURVEY_ID');
    expect(owns).toBeTruthy();
    expect(runQuery.mock.calls[0]).toMatchSnapshot();
  });

});
