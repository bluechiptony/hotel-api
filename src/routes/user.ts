import { Router } from "express";
import { getUsers, createUser } from "../handlers/user/user-adapter";
import { valiedateForUser, validateForAdmininstrator } from "../authorization/authorization";

const UserRoutes = Router();

UserRoutes.get("/get", valiedateForUser, validateForAdmininstrator, getUsers);
UserRoutes.post("/create", validateForAdmininstrator, createUser);

export default UserRoutes;
