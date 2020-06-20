import { Router } from "express";
import { getUsers, createUser } from "../handlers/user/user-adapter";

const UserRoutes = Router();

UserRoutes.get("/get", getUsers);
UserRoutes.post("/create", createUser);

export default UserRoutes;
