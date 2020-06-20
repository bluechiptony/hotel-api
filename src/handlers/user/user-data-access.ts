import * as knex from "knex";
import { User } from "bluechip-b54";
import { Connection } from "../../config/database";
import { DatabaseError, BluechipHelpers } from "bluechip-utils";
import logger from "../../utilities/helpers/logger";
import { AccountType, AuthenticationProfile } from "bluechip-b54";

const userTable: string = "users";
const authenticationTable: string = "authentication";
const connector: knex = new Connection().knex();

export const createUser = async (user: User, creator?: string): Promise<any> => {
  try {
    let result = await connector
      .table(userTable)
      .insert({
        user_code: user.userCode,
        first_name: user.firstName,
        last_name: user.lastName,
        email_address: user.emailAddress,

        account_type: user.accountType,
        created_date: new Date(),
        updated_date: new Date(),
        created_by: creator,
        updated_by: creator,
      })
      .returning("user_code");

    return result[0];
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const updateUser = async (user: User, editor: string): Promise<any> => {
  try {
    let result = await connector
      .table(userTable)
      .update({
        user_code: user.userCode,
        first_name: user.firstName,
        last_name: user.lastName,
        email_address: user.emailAddress,

        account_type: user.accountType,
        updated_by: editor,
        updated_date: new Date(),
      })
      .where({ user_code: user.userCode })
      .returning("user_code");

    return result[0];
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const setUserAccountType = async (userCode: string, accountType: AccountType) => {
  try {
    let result = await connector
      .table(userTable)
      .update({
        account_type: accountType,
        updated_date: new Date(),
      })
      .where({ user_code: userCode })
      .returning("user_code");

    return result[0];
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const getUsers = async (pageSize?: number, pageNumber?: number, dateOrder?: string): Promise<User[]> => {
  try {
    let result = connector.table(userTable).select("*");
    if (pageSize != null && pageNumber != null) {
      result = result.limit(pageSize).offset(pageNumber);
    }
    if (dateOrder != null) {
      result = result.orderBy("created_date", dateOrder);
    }

    let procResult: User[] = BluechipHelpers.camelizeCase(await result);
    return procResult;
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};
export const getUsersAndAccounts = async (pageSize?: number, pageNumber?: number, dateOrder?: string): Promise<any[]> => {
  try {
    let result = connector.table(userTable).select("*");
    // .join(authenticationTable, { "users.user_code": "authentication.user_code" });
    if (pageSize != null && pageNumber != null) {
      result = result.limit(pageSize).offset(pageNumber);
    }
    if (dateOrder != null) {
      result = result.orderBy("created_date", dateOrder);
    }

    let procResult: any[] = BluechipHelpers.camelizeCase(await result);
    procResult.map((user) => {
      delete user.wakanda;
      delete user.verificationCode;
      delete user.verificationCodeExpiry;
      delete user.userId;
      delete user.authId;
      return user;
    });
    let accounts: any[] = procResult;
    return accounts;
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const getUsersPaginated = async (pageNumber: number, pageSize: number): Promise<User[]> => {
  return [];
};

export const getSingleUser = async (userCode: string): Promise<User> => {
  try {
    let result = await connector.table(userTable).select("*").where({ user_code: userCode });
    let user = BluechipHelpers.camelizeCase(result[0]);
    let userRet: User = user;

    return userRet;
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  } finally {
  }
};

export const checkIfUSerExists = async (email: string): Promise<boolean> => {
  try {
    let result = await connector.table(userTable).select("*").where({ email_address: email });
    console.log(result);

    return result.length > 0 ? true : false;
  } catch (error) {
    logger.error(error.message);
    throw new DatabaseError("Internal connection error");
  }
};

export const changeUsersActiveStatus = async (userCode: string) => {};

// let userRet: User = {
//   userId: user.userId,
//   userCode: user.userCode,
//   firstName: user.firstName,
//   lastName: user.lastName,
//   emailAddress: user.emailAddress,
//   accountType: user.accountType
// };
