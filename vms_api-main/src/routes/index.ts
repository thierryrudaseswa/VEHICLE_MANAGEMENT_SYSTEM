import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import vehicleRouter from "./vehicle.route";
import actionRouter from "./action.route";
import modelRouter from "./model.route";

const router = Router();

router.use("/auth", authRouter
    /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use("/user", userRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use("/vehicles", vehicleRouter
    /*
        #swagger.tags = ['Vehicles']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use("/actions", actionRouter
    /*
        #swagger.tags = ['Actions']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);
router.use("/vehicle-models", modelRouter
    /*
        #swagger.tags = ['Vehicle Models']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
);

export default router;
