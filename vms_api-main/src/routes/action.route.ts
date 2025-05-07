import { Router } from "express";
import actionController from "../controllers/action.controller";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { CreateActionDTO, UpdateActionDTO } from "../dtos/action.dto";

const router = Router();

router.post("/", checkAdmin, validationMiddleware(CreateActionDTO), actionController.createAction);
router.get("/", actionController.getActions);
router.get("/:id", checkAdmin, actionController.getActionById);
router.put("/:id", checkAdmin, validationMiddleware(UpdateActionDTO, true), actionController.updateAction);
router.delete("/:id", checkAdmin, actionController.deleteAction);

export default router;
