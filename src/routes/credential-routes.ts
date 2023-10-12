import { validateSchema } from "./../middleware/validate-middleware";
import { Router } from "express";
import { credentialSchema } from "./../schemas/schemas";
import { authenticateToken } from "./../middleware/authentication-middleware";
import { createCredential, deleteCredential, getCredentialById, getCredentials } from "./../controllers/credential-controller";

const credentialRouter = Router();

credentialRouter.post("/credential", validateSchema(credentialSchema), authenticateToken, createCredential)
credentialRouter.get("/credential", authenticateToken, getCredentials)
credentialRouter.get("/credential/:id", authenticateToken, getCredentialById)
credentialRouter.delete("/credential/:id", authenticateToken, deleteCredential)

export default credentialRouter