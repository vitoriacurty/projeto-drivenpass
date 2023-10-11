import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "@prisma/client";
import authRepository from "./../repositories/auth-repository";

// Define um tipo para representar o token, excluindo informações sensíveis do usuário
type Token = Omit<User, "password" | "email">;

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Obtém o cabeçalho 'authorization' da solicitação HTTP
  const { authorization } = req.headers;

   // Remove o prefixo "Bearer " do token, se presente
  const token = authorization?.replace("Bearer ", "");
  // Obtém a chave secreta para verificar o token JWT a partir de variáveis de ambiente
  const secretKey = process.env.JWT_SECRET;
// Se não houver um token, responda com um status 401 (não autorizado)
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    // Verifica o token e obtém o ID do usuário (se o token for válido)
    const { userId } = jwt.verify(token, secretKey) as JwtPayload;

    // Verifica se o usuário existe no banco de dados
    const verifyUser = await authRepository.findUser(userId);

    // Se o usuário não existe, responda com um status 404 (não encontrado)
    if (!verifyUser) {
      return res.sendStatus(404);
    }
    res.locals.user = userId;
  } catch {
    return res.status(401).send("invalid token");
  }

  next();
}

