import { Router } from "express";
import { login, resetPassword, recoverAccount, activateAccount, createAuthenticationProfile } from "../handlers/authentication/authentication-adapter";

const AuthenticationRoutes = Router();

AuthenticationRoutes.post("/login", login);
AuthenticationRoutes.post("/create/account", createAuthenticationProfile);
AuthenticationRoutes.post("/forgot-password", recoverAccount);
AuthenticationRoutes.post("/activate-account", activateAccount);
AuthenticationRoutes.post("/reset-password", resetPassword);

export default AuthenticationRoutes;
