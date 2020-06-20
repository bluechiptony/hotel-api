import { Router } from "express";
import { login, resetPassword, recoverAccount, activateAccount } from "../handlers/authentication/authentication-adapter";

const AuthenticationRoutes = Router();

AuthenticationRoutes.post("/login", login);
AuthenticationRoutes.post("/forgot-password", recoverAccount);
AuthenticationRoutes.post("/activate-account", activateAccount);
AuthenticationRoutes.post("/reset-password", resetPassword);

export default AuthenticationRoutes;
