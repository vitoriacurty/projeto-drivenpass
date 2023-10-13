import { Request, Response } from "express";
import httpStatus from "http-status";
import authService from "./../services/auth-service"
import { AuthEntity } from "../../protocols";

async function signUp(req: Request, res: Response) {
    // Extrai o email e senha da solicitação HTTP
    const { email, password } = req.body as AuthEntity

    try {
       // Chama o service de autenticação para realizar o registro
    const result = await authService.signUp({ email, password })
    return res.status(httpStatus.CREATED).send(result) 
    } catch (error) {
        res.status(error).json("email já em uso")
    }
}

async function signIn(req: Request, res: Response) {
    const { email, password } = req.body as AuthEntity;


    try {
        const result = await authService.signIn(email, password);
        return res.status(httpStatus.OK).send({ result });
    } catch (error) {
        res.status(error).json("email inexistente")
    }
}

export const authController = { signUp, signIn }