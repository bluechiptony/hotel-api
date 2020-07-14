import { Request, Response } from "express";
import { BluechipHelpers } from "bluechip-utils";
import logger from "../../utilities/helpers/logger";
import { getStatusCodeFromException } from "bluechip-utils/lib/responses/responses";
import { userGetsAllUsers, systemOrUserCreatesUser } from "./user-use-cases";

import { User } from "hotel-lib";

export const createUser = async (req: Request, res: Response) => {
  try {
    let request = BluechipHelpers.adaptExpressRequest(req);
    let userCode: string = await systemOrUserCreatesUser(request.body, request.user);
    res.status(201).json({ userCode: userCode });
  } catch (error) {
    logger.error(error.message);
    let messageText = error.message || "Sorry: Unable to process request";
    let message = { message: messageText };
    res.status(getStatusCodeFromException(error)).json(message);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    let request = BluechipHelpers.adaptExpressRequest(req);

    let filterParams = request.queryParams;
    let users: User[] = await userGetsAllUsers(filterParams.pagesize, filterParams.pagenumber, filterParams.order);
    res.status(200).json(users);
  } catch (error) {
    logger.error(error.message);
    let messageText = error.message || "Sorry: Unable to process request";
    let message = { message: messageText };
    res.status(getStatusCodeFromException(error)).json(message);
  }
};
