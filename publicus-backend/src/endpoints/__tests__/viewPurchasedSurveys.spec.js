import { main } from '../viewPurchasedSurveys';
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
  }
};

describe('viewPurchasedSurveys', () => {

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

  test(`should return all purchased surveys`, async () => {
    runQuery.mockResolvedValue([{ MOCK: 'FORM' }]);
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  })

});