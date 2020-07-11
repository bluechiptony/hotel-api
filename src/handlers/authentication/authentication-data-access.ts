import * as knex from "knex";
import { Connection } from "../../config/database";
import { DatabaseError } from "bluechip-utils";
import { BluechipHelpers } from "bluechip-utils";
import { AuthenticationProfile } from "hotel-lib";
import logger from "../../utilities/helpers/logger";

const connector: knex = new Connection().knex();

const authTable: string = "authentication";

export const createAuthenticationProfile = async (authProfile: AuthenticationProfile): Promise<any> => {
  try {
    let result = await connector
      .table(authTable)
      .insert({
        user_code: authProfile.userCode,
        email_address: authProfile.emailAddress,
        account_type: authProfile.accountType,
        active: authProfile.active,
        activation_token: authProfile.activationToken,
        token_expiry: authProfile.tokenExpiry,
        created_date: new Date(),
        updated_date: new Date(),
      })
      .returning("user_code");

    if (Array.isArray(result)) {
      return result[0];
    } else {
      return result;
    }
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const updateAuthenticationProfile = async (authProfile: AuthenticationProfile) => {
  try {
    let result = await connector
      .table(authTable)
      .update({
        email_address: authProfile.emailAddress,
        account_type: authProfile.accountType,
        active: authProfile.active,
        activation_token: authProfile.activationToken,
        token_expiry: authProfile.tokenExpiry,
        created_date: new Date(),
        updated_date: new Date(),
      })
      .where({ auth_id: authProfile.userCode })
      .returning("email_address");
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const updateProfileForPasswordRequest = async (emailAddress: string, token: string) => {
  try {
    let result = connector
      .table(authTable)
      .update({
        activation_token: token,
        token_expiry: new Date(new Date().getTime() + 84000000),
        updated_date: new Date(),
      })
      .where({ email_address: emailAddress })
      .returning("email_address");

    return result;
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const updateAuthProfilePassword = async (password: string, verificationCode: string) => {
  try {
    let result = connector
      .table(authTable)
      .update({
        wakanda: password,
        active: true,
        updated_date: new Date(),
      })
      .where({ activation_token: verificationCode })
      .returning("user_code");
    // let email:any[]  = result;
    return result;
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const getAuthenticationProfileViaUserCode = async (userCode: string) => {
  try {
    let result = await connector.table(authTable).select("*").where({ user_code: userCode });
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const getAuthenticationProfileViaVerificationCode = async (verificationCode: string) => {
  try {
    let result = await connector.table(authTable).select("*").where({ activation_token: verificationCode });
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const getValidAuthenticationProfile = async (emailAddress: string, password: string) => {
  try {
    let result = await connector.table(authTable).select("*").where({ email_address: emailAddress });

    let authPrf = result[0];
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const getAuthenticationProfileViaEmail = async (emailAddress: string): Promise<AuthenticationProfile> => {
  try {
    let result = await connector.table(authTable).select("*").where({ email_address: emailAddress });

    const profile: any = BluechipHelpers.camelizeCase(result[0]);
    let authProd: AuthenticationProfile = {
      id: profile.authId,
      userCode: profile.userCode,
      emailAddress: profile.emailAddress,
      active: profile.active,
      accountType: profile.accountType,
      password: profile.wakanda,
      activationToken: profile.acttivationToken,
      tokenExpiry: profile.tokenExpiry,
    };

    return authProd;
  } catch (error) {
    logger.error(error.message);

    throw new DatabaseError("Internal connection error");
  }
};

export const getAccountTypes = async () => {
  try {
    let result: any = await connector.raw(`SELECT unnest(enum_range(NULL::account_type))`);
    let types: any[] = result.rows.map((accountType: { unnest: any }) => {
      return accountType.unnest;
    });
    return types;
  } catch (error) {
    logger.error(error.message);
  }
  // return [];
};

export const checkIfAuthenticationProfileExists = async (emailAddress: string): Promise<boolean> => {
  try {
    let result: any = await connector.table(authTable).count("email_address").where({ email_address: emailAddress });

    return result[0].count > 0 ? true : false;
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const checkIfTokenIsValidForUserEmail = async (emailAddress: string, token: string) => {};

export const checkIfTokenIsValid = async (token: string): Promise<boolean> => {
  try {
    let result = await connector.table(authTable).select("token_expiry").where({ activation_token: token });

    // console.log(result[0].token_expiry);

    return result[0].token_expiry > new Date().getTime() ? true : false;
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};
export const getTokenAndExpiry = async (token: string): Promise<string> => {
  try {
    let result = await connector.table(authTable).select("token_expiry").where({ activation_token: token });

    return result[0];
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};
