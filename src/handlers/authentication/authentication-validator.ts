import { BlueChipValidators, InvalidDataTypeError } from "bluechip-utils";
import { PasswordCreationRequest } from "bluechip-b54";
import { generateToken } from "../../utilities/helpers/authentication";
import { LoginRequest, AccountType, AuthenticationProfile } from "bluechip-b54";

export const validateUserLoginRequest = (request: any): LoginRequest => {
  BlueChipValidators.validateRequiredStringProperty("Email address", request.emailAddress);
  BlueChipValidators.validateRequiredStringProperty("Password", request.password);

  return {
    emailAddress: request.emailAddress.toLowerCase(),
    password: request.password,
  };
};

export const validatePasswordChangeRequest = (request: any): PasswordCreationRequest => {
  BlueChipValidators.validateRequiredStringProperty("Token", request.token);
  BlueChipValidators.validateRequiredStringProperty("Password", request.password);

  return {
    token: request.token,
    password: request.password,
  };
};

export const validateAccountType = (accountType: string): boolean => {
  if (Object.keys(AccountType).includes(accountType)) {
    return true;
  } else {
    // return false;
    throw new InvalidDataTypeError("Invalid account type");
  }
};

export const validateAccountRequest = (request: any): AuthenticationProfile => {
  BlueChipValidators.validateRequiredStringProperty("User code", request.userCode);
  BlueChipValidators.validateRequiredStringProperty("Email address", request.emailAddress);
  validateAccountType(request.accountType);

  let authProfile: AuthenticationProfile = {
    emailAddress: request.emailAddress.toLowerCase(),
    userCode: request.userCode,
    accountType: request.accountType,
    active: false,
    activationToken: generateToken(256),
    tokenExpiry: new Date(new Date().getTime() + 84000000),
  };

  return authProfile;
};
