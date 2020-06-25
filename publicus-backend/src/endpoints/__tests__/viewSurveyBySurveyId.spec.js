import { main } from '../viewSurveyBySurveyId';
import { runQuery } from "../../../libs/mysql";

jest.mock("../../../libs/mysql");

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

describe('viewSurveyBySurveyId', () => {

  beforeEach(() => {
  });

  afterEach(() => {
    runQuery.mockReset();
  });

  test(`should respond with failure when an error occurs`, async () => {
    runQuery.mockImplementation(() => {
      throw new Error('ERROR')
    });
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

  test(`should return the survey of the passed id`, async () => {
    runQuery
      .mockResolvedValueOnce([{ surveyId: 'SURVEY_ID' }])
      .mockResolvedValueOnce([{ tag: 'TAG' }]);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  test(`should fail if survey ID doesnt exist`, async () => {
    runQuery
      .mockResolvedValueOnce([]);
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  })

});