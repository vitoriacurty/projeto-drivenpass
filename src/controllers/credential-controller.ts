import { Request, Response } from "express";
import httpStatus from "http-status";
import { credentialService } from "./../services/credential-service";
import { CredentialEntity } from "../../protocols";

// criar uma nova credencial 
export async function createCredential(req: Request, res: Response) {
    // Extrai dados da solicitação, incluindo URL, nome de usuário, senha e título
  const { url, username, password, title } = req.body as CredentialEntity;
  const userId = res.locals.user;

   // Verifique se o corpo da solicitação está ausente
   if (!url || !username || !password || !title) {
    // Se o corpo da solicitação estiver ausente, retorne 401 (UNAUTHORIZED)
    return res.status(httpStatus.UNAUTHORIZED).send("Unauthorized - Body is missing");
  }
  
  try {
    // Chama o service para criar uma nova credencial
    const credential = await credentialService.createCredential({
      url,
      username,
      password,
      title,
      userId,
    });
     // Responde com um status 200 (OK) após a criação bem-sucedida
    return res.status(httpStatus.CREATED).send(credential);
  } catch (err) {
    // Em caso de erro, responde com um status 403 
    return res.status(httpStatus.UNAUTHORIZED).send("Erro ao criar a credencial");
  }
}

// obter todas as credenciais de um usuário
export async function getCredentials(req: Request, res: Response) {
  const userId = res.locals.user;
  try {
    // Chama o serviço para obter todas as credenciais do usuário
    const getCredentials = await credentialService.getCredentials(userId);
    // Responde com um status 200 (OK) e envia as credenciais obtidas
    return res.status(httpStatus.OK).send(getCredentials);
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

// obter uma credencial específica com base no ID
export async function getCredentialById(req: Request, res: Response) {
  const { credentialId } = req.params;
  const userId = res.locals.user;
  try {
    // Chama o service para encontrar uma credencial com base no ID e usuário
    const credential = await credentialService.findCredentialById(
      parseInt(credentialId),
      userId
    );
    return res.status(httpStatus.OK).send(credential);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

// excluir uma credencial com base no ID
export async function deleteCredential(req: Request, res: Response) {
  const { credentialId } = req.params;
  const userId = res.locals.user;

  try {
    // Chama o service para excluir uma credencial com base no ID e usuário
    await credentialService.deleteCredential(parseInt(credentialId), userId)
    return res.sendStatus(httpStatus.NO_CONTENT)
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}