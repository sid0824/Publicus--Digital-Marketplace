import { main } from '../getUserAvatarPostUrl';
import { runQuery } from "../../../libs/mysql";
import uuidv1 from 'uuid/v1';
import {getSignedUrl} from "../../util/QueryUtil";

jest.mock("../../../libs/mysql");
jest.mock('uuid/v1');
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
    formId: 'MOCK_SURVEY_ID'
  },
  queryStringParameters: {
    fileType: 'FILE_TYPE'
  }
};

describe('getUserAvatarPostUrl', () => {

  beforeEach(() => {
    runQuery.mockResolvedValue(null);
    uuidv1.mockReturnValue('575ea33e-f654-11e9-802a-5aa538984bd8');
    getSignedUrl.mockResolvedValue('http://MOCK_URL.com');
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

  test(`should return a user image post url`, async () => {
    const response = await main(mockEvent);
    expect(runQuery.mock.calls[0][0]).toMatchSnapshot();
    expect(response).toMatchSnapshot();
  })

});