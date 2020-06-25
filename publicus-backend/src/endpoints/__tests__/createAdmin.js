import { main } from '../createAdmin';
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
    comment: 'MOCK_COMMENT'
  }),
  pathParameters: {
    surveyId: 'MOCK_SURVEY_ID'
  }
};

describe('createAdmin', () => {

  beforeEach(() => {
    runQuery.mockResolvedValue(null)
  });

  afterEach(() => {
    runQuery.mockReset();
  });

  test(`should respond with failure when an error occurs`, async () => {
    checkAdmin.mockResolvedValue(true);
    runQuery.mockReset();
    runQuery.mockImplementation(() => {
      throw new Error('ERROR')
    });
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

  test(`should turn a user into an admin`, async () => {
    checkAdmin.mockResolvedValue(true);
    runQuery
      .mockResolvedValueOnce([{ userId: 'MOCK_ID' }])
      .mockResolvedValueOnce(null);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  test(`should fail if user doesnt exist`, async () => {
    checkAdmin.mockResolvedValue(true);
    runQuery
      .mockResolvedValueOnce([]);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  test(`should fail if current user isnt an admin`, async () => {
    checkAdmin.mockResolvedValue(false);
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

});