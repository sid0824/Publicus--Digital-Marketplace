import { main } from '../deleteSurvey';
import { runQuery } from "../../../libs/mysql";
import {checkAdmin, checkOwner} from "../../util/QueryUtil";

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

describe('deleteSurvey', () => {

  beforeEach(() => {
    runQuery.mockImplementation(null)
  });

  afterEach(() => {
    runQuery.mockReset();
  });

  test(`should respond with failure when an error occurs`, async () => {
    checkAdmin.mockImplementation(() => {
      throw new Error('ERROR')
    });
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

  test(`should delete a survey from the database`, async () => {
    checkAdmin.mockResolvedValue(true);
    checkOwner.mockResolvedValue(true);

    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[2][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  test(`should return unauthorised when not admin or owner`, async () => {
    checkAdmin.mockResolvedValue(false);
    checkOwner.mockResolvedValue(false);
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

});