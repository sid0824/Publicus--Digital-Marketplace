import { main } from '../search';
import { runQuery } from "../../../libs/mysql";

jest.mock("../../../libs/mysql");

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: 'MOCK_COGNITO_ID'
    },
  },
  body: JSON.stringify({
    comment: 'MOCK_COMMENT'
  }),
  queryStringParameters: {
    page: "2",
    search: 'SEARCH'
  }
};

describe('search', () => {

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

  test(`should return forms with search from the database`, async () => {
    runQuery
      .mockResolvedValueOnce([{ surveyId: 'SURVEY_ID' }])
      .mockResolvedValueOnce([{ tag: 'TAG' }]);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

  test(`should return forms without search from the database`, async () => {
    runQuery
      .mockResolvedValueOnce([{ surveyId: 'SURVEY_ID' }])
      .mockResolvedValueOnce([{ tag: 'TAG' }]);
    const response = await main({ ...mockEvent,  queryStringParameters: {
        page: "2",
      }}
    );
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  })

});