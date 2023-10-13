import { Request, Response } from "express";
import httpStatus from "http-status";
import authService from "./../services/auth-service"
import { AuthEntity } from "../../protocols";

async function signUp(req: Request, res: Response) {
    // Extrai o email e senha da solicitação HTTP
    const { email, password } = req.body as AuthEntity

    // Chama o service de autenticação para realizar o registro
    const result = await authService.signUp({ email, password })
    return res.status(httpStatus.CREATED).send(result)
}

async function signIn(req: Request, res: Response) {
    const { email, password } = req.body as AuthEntity;

    const result = await authService.signIn(email, password);
    return res.status(httpStatus.OK).send({ result });
}

export const authController = { signUp, signIn }