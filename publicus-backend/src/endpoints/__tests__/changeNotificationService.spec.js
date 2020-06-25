import { main } from '../changeNotificationService';
import { runQuery } from "../../../libs/mysql";
import {checkAdmin} from "../../util/QueryUtil";

jest.mock("../../../libs/mysql");
jest.mock('../../util/QueryUtil');

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: 'MOCK_COGNITO_ID'
    },
  },
  body: JSON.stringify({
    receiveNotifications: 1
  }),
  pathParameters: {
    surveyId: 'MOCK_SURVEY_ID'
  }
};

describe('changeNotificationService', () => {

  beforeEach(() => {

  });

  afterEach(() => {
    runQuery.mockReset();
  });

  test(`should respond with failure when an error occurs`, async () => {
    runQuery.mockReset();
    runQuery.mockImplementation(() => {
      throw new Error('ERROR')
    });
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

  test(`should return unauthorised when admin or owner`, async () => {
    checkAdmin.mockResolvedValue(false);
    runQuery.mockResolvedValueOnce([{ userId: 'MOCK_USER_ID_2' }]);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  test(`should should update the notification value for a form`, async () => {
    checkAdmin.mockResolvedValue(true);
    runQuery.mockResolvedValueOnce([{ userId: 'MOCK_USER_ID_2' }]);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

});