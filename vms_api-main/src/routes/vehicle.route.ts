import { Router } from "express";
import vehicleController from "../controllers/vehicle.controller";
import { checkAdmin } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";
import { CreateVehicleDTO, UpdateVehicleDTO } from "../dtos/vehicle.dto";

const router = Router();

router.post("/", checkAdmin, validationMiddleware(CreateVehicleDTO), vehicleController.createVehicle);
router.get("/",vehicleController.getVehicles);
router.get("/search", vehicleController.searchVehicles);
router.get("/paginated", vehicleController.getAllVehiclesPaginated);
router.get("/:id", vehicleController.getVehicleById);
router.put("/:id", checkAdmin, validationMiddleware(UpdateVehicleDTO, true), vehicleController.updateVehicle);
router.delete("/:id", checkAdmin, vehicleController.deleteVehicle);

export default router;
