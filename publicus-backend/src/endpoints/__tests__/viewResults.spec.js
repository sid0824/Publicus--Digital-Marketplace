import { main } from '../viewResults';
import { runQuery } from "../../../libs/mysql";
import {checkOwnerOrAdmin, checkOwnsForm} from "../../util/QueryUtil";

jest.mock("../../../libs/mysql");
jest.mock('../../util/QueryUtil');

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: 'MOCK_COGNITO_ID'
    },
  },
  body: JSON.stringify({
  }),
  pathParameters: {
    surveyId: 'MOCK_SURVEY_ID'
  }
};

describe('viewResults', () => {

  beforeEach(() => {
  });

  afterEach(() => {
    runQuery.mockReset();
    checkOwnerOrAdmin.mockReset();
    checkOwnsForm.mockReset();
  });

  test(`should respond with failure when an error occurs`, async () => {
    checkOwnerOrAdmin.mockImplementation(() => {
      throw new Error('ERROR')
    });
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

  test(`should return results for a survey`, async () => {
    checkOwnerOrAdmin.mockResolvedValue(true);
    checkOwnsForm.mockResolvedValue(false);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  test(`should fail if user has no access to form`, async () => {
    checkOwnerOrAdmin.mockResolvedValue(false);
    checkOwnsForm.mockResolvedValue(false);
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  })

});