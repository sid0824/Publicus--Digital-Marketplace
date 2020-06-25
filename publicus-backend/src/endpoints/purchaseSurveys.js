import {runQuery} from "../../libs/mysql";
import {failure, success} from "../util/ResponseUtil";
import stripe from 'stripe';
import {getUserValuesById} from "../util/QueryUtil";
import {sendPurchasedEmail} from "../util/EmailUtil";
import {StripeSecretKey} from "../../config/ConfigValues";

//Generates SQL Query (Inserts licenses for each newly purchased survey)
const insertLicensesQuery = (cart, cognitoId) => {
  let sql = "INSERT INTO Licenses(surveyId, userId) VALUES ";
  for(let i = 0; i < cart.length; i++) {
      sql = sql + "( '" + cart[i] + "', '" + cognitoId + "')";
      if(i < cart.length - 1) {
          sql = sql + ",";
      } else {
          sql = sql + ";";
      }
  }
  return sql;
};

// Get survey data based on list of ids
const getSurveyPricesWithIdsQuery = (cart) => {
  let whereClause = '';
  cart.forEach((surveyId, index) => {
    if (index) {
      whereClause += `OR `;
    }
    whereClause += `surveyId = '${surveyId}'`;
  });
  return `SELECT price, userId, receiveNotifications
          FROM Surveys 
          WHERE ${whereClause}`;
};

export async function main(event, context) {
  try {
    const data = JSON.parse(event.body);
    const stripeClient = stripe(StripeSecretKey);

    // Calculate the total cost
    const surveyValues = await runQuery(getSurveyPricesWithIdsQuery(data.cart));
    let totalCost = 0;
    surveyValues.forEach((survey) => {
      totalCost += survey.price;
    });

    // Make the charge for the stripe account
    await stripeClient.charges.create({
      amount: totalCost * 100,
      currency: "AUD",
      description: "Publicus - Survey Purchase",
      source: data.tokenId
    });
    await runQuery(insertLicensesQuery(data.cart, event.requestContext.identity.cognitoIdentityId));

    //Send email to owners
    const userIds = Array.from(new Set(surveyValues.filter(value => value.receiveNotifications).map(value => value.userId)));
    await Promise.all(userIds.map(async (userId) => {
      const userData = await runQuery(getUserValuesById(userId));
      return sendPurchasedEmail(userData[0].email);
    }));

    return success();
  } catch (err) {
    console.error(err);
    return failure();
  }
}
