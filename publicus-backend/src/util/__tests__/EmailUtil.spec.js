import { ses } from '../../../libs/Aws';
import {sendAcceptedEmail, sendPurchasedEmail} from "../EmailUtil";

jest.mock('../../../libs/Aws');

describe('EmailUtil', () => {

  test(`should send a purchased email`, async () => {
    ses.sendEmail.mockImplementation((params) => {
      expect(params).toMatchSnapshot();
      return {
        promise: Promise.resolve()
      }
    });
    await sendPurchasedEmail('www.mockEmail.com')
  });

  test(`should send an approval email`, async () => {
    ses.sendEmail.mockImplementation((params) => {
      expect(params).toMatchSnapshot();
      return {
        promise: Promise.resolve()
      }
    });
    await sendAcceptedEmail('www.mockEmail.com', { userId: 'USER_ID', name: 'NAME' })
  });

});