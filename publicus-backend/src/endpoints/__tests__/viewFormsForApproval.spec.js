import { main } from '../viewFormsForApproval';
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

describe('viewFormsForApproval', () => {

  beforeEach(() => {
  });

  afterEach(() => {
    runQuery.mockReset();
    checkAdmin.mockReset();
  });

  test(`should respond with failure when an error occurs`, async () => {
    checkAdmin.mockImplementation(() => {
      throw new Error('ERROR')
    });
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

  test(`should fetch forms that require approval`, async () => {
    checkAdmin.mockResolvedValue(true);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  test(`should fail if user isnt admin`, async () => {
    checkAdmin.mockResolvedValue(false);
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

});