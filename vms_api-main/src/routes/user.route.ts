import { ErrorRequestHandler, RequestHandler, Router } from "express";
import userController from "../controllers/user.controller";
import {
  ChangePasswordDTO,
  CreateUserDTO,
  UpdateAvatarDTO,
  UpdateUserDTO,
} from "../dtos/user.dto";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const userRouter = Router();

userRouter.post(
  "/create",
  [validationMiddleware(CreateUserDTO)],
  userController.createUser
);
userRouter.put(
  "/update",
  [checkLoggedIn, validationMiddleware(UpdateUserDTO)],
  userController.updateUser
);
userRouter.get("/me", [checkLoggedIn], userController.me);
userRouter.get("/all", [checkAdmin], userController.all);
userRouter.get("/:id", [], userController.getById);
userRouter.get("/search/:query", [], userController.searchUser);
userRouter.delete("/me", [checkLoggedIn], userController.deleteUser);
userRouter.delete(
  "/remove-avatar",
  [checkLoggedIn],
  userController.removeAvatar
);
userRouter.delete("/by-id/:id", [checkAdmin], userController.deleteById);
userRouter.put(
  "/update-avatar",
  [checkLoggedIn, validationMiddleware(UpdateAvatarDTO)],
  userController.updateAvatar
);
userRouter.put(
  "/update-password",
  [checkLoggedIn, validationMiddleware(ChangePasswordDTO)],
  userController.updatePassword
);

export default userRouter;
