import {FormPublishedStates, main} from '../modifySurveyStatus';
import { runQuery } from "../../../libs/mysql";
import {checkAdmin, checkOwner, getUserNotificationSetting} from "../../util/QueryUtil";
import {sendAcceptedEmail} from "../../util/EmailUtil";

jest.mock("../../../libs/mysql");
jest.mock("../../util/QueryUtil");
jest.mock("../../util/EmailUtil");

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

describe('modifySurveyStatus', () => {

  beforeEach(() => {
    getUserNotificationSetting.mockResolvedValue(1);
  });

  afterEach(() => {
    runQuery.mockReset();
    checkOwner.mockReset();
    checkAdmin.mockReset();
  });

  test(`should respond with failure when an error occurs`, async () => {
    runQuery.mockImplementation(() => {
      throw new Error('ERROR')
    });
    const response = await main(mockEvent);
    expect(response).toMatchSnapshot();
  });

  test(`should fail when a non owner tries to submit form`, async () => {
    const response = await main({ ...mockEvent, body: JSON.stringify({
        surveyId: 'SURVEY_ID',
        status: FormPublishedStates.SUBMITTED
      })}
    );
    await checkOwner.mockResolvedValue(false);
    expect(response).toMatchSnapshot();
  });


  test(`should fail when a non admin tries to reject`, async () => {
    const response = await main({ ...mockEvent, body: JSON.stringify({
        surveyId: 'SURVEY_ID',
        status: FormPublishedStates.REJECTED
      })}
    );
    await checkAdmin.mockResolvedValue(false);
    expect(response).toMatchSnapshot();
  });

  test(`should publish form and send email`, async () => {
    checkAdmin.mockResolvedValue(true);
    runQuery
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce([{ userId: 'USER_ID' }])
      .mockResolvedValueOnce([{ email: 'EMAIL' }]);
    const response = await main({ ...mockEvent, body: JSON.stringify({
        surveyId: 'SURVEY_ID',
        status: FormPublishedStates.PUBLISHED
      })}
    );
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[1][0]).toMatchSnapshot();
    expect(runQuery.mock.calls[2][0]).toMatchSnapshot();
    expect(sendAcceptedEmail.mock.calls[0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  });

});