import { main } from '../addRating';
import { runQuery } from "../../../libs/mysql";

jest.mock("../../../libs/mysql");

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: 'MOCK_COGNITO_ID'
    },
  },
  body: JSON.stringify({
    rating: 2
  }),
  pathParameters: {
    surveyId: 'MOCK_SURVEY_ID'
  }
};

describe('addRating', () => {

  beforeEach(() => {

  });

  afterAll(() => {
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

  test('should update a users rating for a survey', async () => {
    runQuery
      .mockResolvedValueOnce([{ rating: 4 }])
      .mockResolvedValue(null);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });


  test('should add a new rating for a users survey', async () => {
    runQuery
      .mockResolvedValueOnce([])
      .mockResolvedValue(null);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  })

});