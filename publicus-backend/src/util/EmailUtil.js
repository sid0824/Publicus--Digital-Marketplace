import { ses } from '../../libs/Aws';
import { SiteUrl, SourceEmail } from "../../config/ConfigValues";

const sendEmail = async (email, subject, body) => {
  const params = {
    Destination: {
      ToAddresses: [
        email
      ]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject
      }
    },
    Source: SourceEmail,
  };
  try {
    await ses.sendEmail(params).promise();
  } catch (err) {
    console.error(err);
  }
};

export const sendPurchasedEmail = async (email) => {
  const body = `One of your forms was purchased on the Publicus Marketplace. View in the site.\n${SiteUrl}/myForms`;
  const subject  = "A User Purchased Your Form";
  await sendEmail(email, subject, body);
};

export const sendAcceptedEmail = async (email, form) => {
  const body = `Your form '${form.name}' was approved for the Publicus Marketplace by an administrator.\nIt can now be purchased any used by other users.\n${SiteUrl}/marketplace?search=${form.userId}`;
  const subject  = "Your Form was Approved For the Marketplace!";
  await sendEmail(email, subject, body);
};