import { main } from '../createSurvey';
import { runQuery } from "../../../libs/mysql";
import uuidv1 from 'uuid/v1';

jest.mock("../../../libs/mysql");
jest.mock('uuid/v1');

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: 'MOCK_COGNITO_ID'
    },
  },
  body: JSON.stringify({
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

describe('createSurvey', () => {

  beforeEach(() => {
    runQuery.mockResolvedValue(null);
    uuidv1.mockReturnValue('575ea33e-f654-11e9-802a-5aa538984bd8');
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

  test(`should add the survey to the database`, async () => {
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  })

});