import { BlueChipValidators } from "bluechip-utils";
import { User } from "hotel-lib";
import { generateToken } from "../../utilities/helpers/authentication";
import { validateAccountType } from "../authentication/authentication-validator";

export const validateNewUser = (request: any): User => {
  BlueChipValidators.validateRequiredStringProperty("First name", request.firstName);
  BlueChipValidators.validateRequiredStringProperty("Last name", request.lastName);
  BlueChipValidators.validateRequiredStringProperty("Email address", request.emailAddress);
  validateAccountType(request.accountType);

  let userCode: string = generateToken(10).toUpperCase();
  let user: User = {
    userCode: userCode,
    firstName: request.firstName,
    lastName: request.lastName,
    emailAddress: request.emailAddress.toLowerCase(),
    accountType: request.accountType,
  };

  return user;
};
