import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "../utilities/helpers/authentication";
import { User, AccountType } from "hotel-lib";

export const validateForAdmininstrator = async (req: Request, res: Response, next: NextFunction) => {
  let authorization = req.headers["authorization"];
  try {
    if (authorization) {
      let user: User = await getUserFromToken(authorization);
      if ("ADMINISTRATOR" === user.accountType || "SUPER_ADMINISTRATOR" === user.accountType) {
        next();
      } else {
        res.status(403).json("You are not authorized to access this resource");
      }
    } else {
      res.status(401).json("Yoi're not able to access B-54: Please contact your administrator");
    }
  } catch (error) {
    res.status(401).json("Invalid authentication");
  }
};

export const valiedateForUser = async (req: Request, res: Response, next: NextFunction) => {
  let authorization = req.headers["authorization"];
  try {
    if (authorization) {
      let user: User = await getUserFromToken(authorization);
      if (Object.keys(AccountType).includes(user.accountType)) {
        next();
      }
    } else {
      res.status(401).json("Yoi're not able to access B-54: Please contact your administrator");
    }
  } catch (error) {
    res.status(401).json("Invalid authentication");
  }
};
