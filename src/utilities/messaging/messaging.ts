import Mailgun from "mailgun-js";
import logger from "../helpers/logger";
import * as dotenv from "dotenv";
dotenv.config();

const apiKey: string = process.env.MAILGUN_KEY || "";
const domain: string = process.env.MAILGUN_DOMAIN || "";
const mailgun = Mailgun({
  apiKey: apiKey,
  domain: domain,
});

export const sendAccountActivationMessage = (emailAddress: string, activationCode: string, publicAccess: boolean): void => {
  let messageDetails: any = {
    from: "B-54 <donot-reply@nassconnect.ng>",
    to: emailAddress,
    subject: "Account Activation",
    template: "coop_activate_account",
    "h:X-Mailgun-Variables": JSON.stringify({ actionUrl: `${process.env.APP_PORTAL_DOMAIN}/activate-account/${activationCode}` }),
  };

  mailgun.messages().send(messageDetails, (err, body) => {
    logger.info(body);

    if (err) {
      logger.error(err.message);
    }
  });
};

export const sendPasswordRecoveyMessage = (emailAddress: string, activationCode: string, publicDomain: boolean): void => {
  let messageDetails: any = {
    from: "B-54 <donot-reply@nassconnect.ng>",
    to: emailAddress,
    subject: "Password Recovery",
    template: "coop_recover_password",
    "h:X-Mailgun-Variables": JSON.stringify({ actionUrl: `${process.env.APP_PORTAL_DOMAIN}/reset-password/${activationCode}` }),
  };

  mailgun.messages().send(messageDetails, (err, body) => {
    logger.info(body);
    if (err) {
      logger.error(err.message);
    }
  });
};

export const sendBeneficiaryRegistrationMessage = (emailAddress: string, userCode: string, firstName: string): void => {
  let messageDetails: any = {
    from: "B-54 <donot-reply@nassconnect.ng>",
    to: emailAddress,
    subject: "Insurance Enrollment",
    template: "enrolment_confirmation",
    "h:X-Mailgun-Variables": JSON.stringify({ activationUrl: `${process.env.APP_PORTAL_DOMAIN}/create-account/${userCode}`, firstName: firstName, beneficiaryCode: userCode }),
  };

  //TODO

  mailgun.messages().send(messageDetails, (err, body) => {
    if (err) {
      logger.error(err.message);
    } else {
      logger.error(body);
    }
  });
};
