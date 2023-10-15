import joi from "joi";
import { Credential } from "@prisma/client";
import { AuthEntity } from "../../protocols";

export const authSchema = joi.object<AuthEntity>({
  email: joi.string().email().required(),
  password: joi.string().min(10).required(),
});

// Define um tipo de entrada para credenciais excluindo o campo "id"
type CredentialInput = Omit<Credential, "id">
// export type CredentialUser = Omit<Credential, 'id'>;

export const credentialSchema = joi.object<CredentialInput>({
  title: joi.string().required(),
  url: joi.string().uri().required(),
  username: joi.string().required(),
  password: joi.string().required()
})