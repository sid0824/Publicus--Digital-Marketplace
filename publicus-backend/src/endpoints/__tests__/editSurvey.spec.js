import { main } from '../editSurvey';
import { runQuery } from "../../../libs/mysql";

jest.mock("../../../libs/mysql");

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: 'MOCK_COGNITO_ID'
    },
  },
  body: JSON.stringify({
    surveyId: 'SURVEY_ID',
    name: 'NAME',
    price: 5,
    form: [{ MOCK: 'FORM' }],
    description: 'DESCRIPTION',
    redirect: 'REDIRECT',
    instructions: 'INSTRUCTIONS',
    tags: ["TAG1", "TAG2"]
  }),
  pathParameters: {
    surveyId: 'MOCK_SURVEY_ID'
  }
};

describe('editSurvey', () => {

  beforeEach(() => {
    runQuery.mockResolvedValue(null)
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

  test(`should edit an existing survey`, async () => {
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  })

});