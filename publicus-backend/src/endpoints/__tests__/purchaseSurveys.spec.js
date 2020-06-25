import { main } from '../purchaseSurveys';
import { runQuery } from "../../../libs/mysql";
import stripe from 'stripe';
import {sendPurchasedEmail} from "../../util/EmailUtil";

jest.mock("../../../libs/mysql");
jest.mock('stripe');
jest.mock( "../../util/EmailUtil");

const mockEvent = {
  requestContext: {
    identity: {
      cognitoIdentityId: 'MOCK_COGNITO_ID'
    },
  },
  body: JSON.stringify({
    cart: ['SURVEY_ID_1', 'SURVEY_ID_2'],
    tokenId: 'TOKEN_ID'
  }),
  pathParameters: {
    surveyId: 'MOCK_SURVEY_ID'
  }
};

const makeCharge = jest.fn();

describe('purchaseSurveys', () => {

  beforeEach(() => {
    stripe.mockReturnValue({
      charges: {
        create: makeCharge
      }
    })
  });

  afterEach(() => {
    runQuery.mockReset();
    makeCharge.mockReset();
  });

  test(`should respond with failure when an error occurs`, async () => {
    runQuery.mockImplementation(() => {
      throw new Error('ERROR')
    });
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

  test(`should purchase surveys`, async () => {
    runQuery
      .mockResolvedValueOnce([
          { price: 3, userId: 'USER_ID_1', receiveNotifications: 0 },
          { price: 4, userId: 'USER_ID_2', receiveNotifications: 1 }
        ])
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce([{ email: 'EMAIL' }]);

    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[2][0]).toMatchSnapshot();
    expect(sendPurchasedEmail.mock.calls[0][0]).toMatchSnapshot();
    expect(makeCharge.mock.calls[0][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  })

});