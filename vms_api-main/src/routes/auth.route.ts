import { RequestHandler, Router } from "express";
import authController from "../controllers/auth.controller";
import {
  InitiateResetPasswordDTO,
  InitiateVerifyEmailDTO,
  LoginDTO,
  ResetPasswordDTO,
} from "../dtos/auth.dto";
import { checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const authRouter = Router();

authRouter.post(
  "/login",
  [validationMiddleware(LoginDTO)],
  authController.login
);
authRouter.put(
  "/initiate-reset-password",
  [validationMiddleware(InitiateResetPasswordDTO)],
  authController.initiateResetPassword
);
authRouter.put(
  "/reset-password",
  [validationMiddleware(ResetPasswordDTO)],
  authController.resetPassword
);
authRouter.put(
  "/initiate-email-verification",
  [checkLoggedIn],
  [validationMiddleware(InitiateVerifyEmailDTO)],
  authController.initiateEmailVerification
);
authRouter.put(
  "/verify-email/:code",
  [checkLoggedIn],
  authController.verifyEmail
);

export default authRouter;
