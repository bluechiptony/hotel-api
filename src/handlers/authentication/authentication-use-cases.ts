import { generateToken } from "../../utilities/helpers/authentication";
import { LoginRequest, AuthenticationProfile, PasswordCreationRequest } from "bluechip-b54";

import { validateUserLoginRequest, validateAccountRequest, validatePasswordChangeRequest } from "./authentication-validator";
import { makeHttpErrorFromException, AppResponse } from "bluechip-utils/lib/responses/responses";
import { getAuthenticationProfileViaEmail, checkIfTokenIsValidForUserEmail, checkIfAuthenticationProfileExists, getAccountTypes, createAuthenticationProfile, updateProfileForPasswordRequest, checkIfTokenIsValid, updateAuthProfilePassword } from "./authentication-data-access";
import { comparePassword, createAuthTokenForUser, generateHashforPasswordText } from "../../utilities/helpers/authentication";
import { getSingleUser } from "../user/user-data-access";
import { User } from "bluechip-b54";
import { terminalLogger as logger } from "../../utilities/helpers/logger";
// import { sendAccountActivationMessage, sendPasswordRecoveyMessage } from "../../utilities/messaging/messaging";

export const systemPerformsUserLogin = async (request: any): Promise<AppResponse> => {
  let loginRequest: LoginRequest;
  let authenticationProfile: AuthenticationProfile;
  try {
    loginRequest = await validateUserLoginRequest(request);
    authenticationProfile = await getAuthenticationProfileViaEmail(loginRequest.emailAddress.toLowerCase());

    let valid = await comparePassword(loginRequest.password, authenticationProfile.password);
    if (!valid) {
      throw new Error("Invalid username/ password");
    }
    let user: User = await getSingleUser(authenticationProfile.userCode);
    let token: string = await createAuthTokenForUser(user);

    return { statusCode: 200, data: token };
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const userCreatesAuthenticationProfile = async (request: any): Promise<string> => {
  try {
    let authProfile: AuthenticationProfile = await validateAccountRequest(request);

    if (await checkIfAuthenticationProfileExists(authProfile.emailAddress)) {
      throw new Error("Authentication profile already exists");
    }

    let saveResult = await createAuthenticationProfile(authProfile);

    // if (authProfile.verificationCode != undefined) {
    //   sendAccountActivationMessage(authProfile.emailAddress, authProfile.activationToken, true);
    // }

    return authProfile.userCode;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const userMakesForgotPasswordRequest = async (request: any) => {
  try {
    if (!request.body.emailAddress) {
      throw new Error("Please provide an email address");
    }

    if (!(await checkIfAuthenticationProfileExists(request.body.emailAddress))) {
      throw new Error("Email address doesn not exist on our system");
    }

    let token: string = generateToken(256);

    let result = await updateProfileForPasswordRequest(request.body.emailAddress, token);
    // console.log(result);
    // if (result != undefined) {
    //   sendPasswordRecoveyMessage(request.body.emailAddress, token, true);
    // }
    return `Password recovery email sent to ${request.body.emailAddress}`;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const userSetsPassword = async (request: any) => {
  try {
    let passwordRequest: PasswordCreationRequest = await validatePasswordChangeRequest(request.body);

    if (!(await checkIfTokenIsValid(passwordRequest.token))) {
      throw new Error("Unfortunately request token is expired");
    }

    let hashedPassword = await generateHashforPasswordText(passwordRequest.password);
    let result = await updateAuthProfilePassword(hashedPassword, passwordRequest.token);

    return "Account successfully activated";
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const userResetsPassword = async (request: any) => {
  try {
    let passwordRequest: PasswordCreationRequest = await validatePasswordChangeRequest(request.body);

    if (!(await checkIfTokenIsValid(passwordRequest.token))) {
      throw new Error("Unfortunately request token is expired");
    }

    let hashedPassword = await generateHashforPasswordText(passwordRequest.password);
    let result = await updateAuthProfilePassword(hashedPassword, passwordRequest.token);

    return "Password was successfully changed";
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export const userGetsAccountTypes = async (request: any) => {
  try {
    let accountTypes = await getAccountTypes();
    return accountTypes;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};
