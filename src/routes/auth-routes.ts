import { authController } from "./../controllers/auth-controller"
import { Router } from "express";
import { validateSchema } from "./../middleware/validate-middleware";
import { authSchema } from "./../schemas/schemas";

// Cria uma instância do roteador Express
const authRouter = Router();

authRouter.post("/signup", validateSchema(authSchema), authController.signUp);
authRouter.post("/signin", validateSchema(authSchema), authController.signIn);

export default authRouter;