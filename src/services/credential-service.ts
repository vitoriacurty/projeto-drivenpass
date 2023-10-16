import { CredentialPost } from "../../protocols";
import Cryptr from "cryptr";
import { credentialRepository } from "./../repositories/credential-repository";
import { CONFLICT, UNAUTHORIZED } from "http-status";

const cryptr = new Cryptr(process.env.CRYPTR);

// criar uma nova credencial
async function createCredential(credential: CredentialPost) {
    const { url, username, password, title, userId } = credential;
    try {
        // Verifica se uma credencial com o mesmo título já existe para o mesmo usuário
        await credentialExists(title, userId);

        // Criptografa a senha fornecida
        const encryptedPassword = await cryptPass(password);

        // Cria a nova credencial no repositório
        return await credentialRepository.createUserCredential({
            url,
            username,
            title,
            encryptedPassword,
            userId,
        });
    } catch (err) {
        throw UNAUTHORIZED;
    }
}

// verificar a existência de uma credencial com o mesmo título
async function credentialExists(title: string, userId: number) {
    const credentialsUser = await credentialRepository.getCredentials(userId);
    const verifyTitle = credentialsUser.filter(
        (credential) => credential.title === title
    );

    // Se uma credencial com o mesmo título já existe, lança um erro de conflito
    if (verifyTitle.length !== 0) {
        throw CONFLICT;
    }

    return credentialExists;
}

// criptografar uma senha
async function cryptPass(password: string) {
    // Criptografa a senha usando o Cryptr
    const encryptedPassword = cryptr.encrypt(password);

    return encryptedPassword;
}

// obter todas as credenciais de um usuário
async function getCredentials(userId: number) {
    const userCredentials = await credentialRepository.getCredentials(userId);
    const newUser = userCredentials.map((credentail) => {
        return {
            ...credentail,
            // Descriptografa a senha antes de retornar
            password: cryptr.decrypt(credentail.password),
        };
    });
    return newUser;
}

// encontrar uma credencial com base no ID 
async function findCredentialById(credentialId: number, userId: number) {
    const confirmUser = await credentialRepository.confirmUser(credentialId);
    // Verifica se o usuário que fez a solicitação é o proprietário da credencial
    if (confirmUser.userId !== userId) {
        throw CONFLICT;
    }

    // Descriptografa a senha antes de retornar os dados da credencial
    const newConfirmUser = cryptr.decrypt(confirmUser.password);

    const data = {
        id: confirmUser.id,
        title: confirmUser.title,
        username: confirmUser.username,
        password: newConfirmUser,
        userId: confirmUser.userId,
    };

    return data;
}

// excluir uma credencial
async function deleteCredential(credentialId: number, userId: number) {
    
    const confirmUser = await credentialRepository.confirmUser(credentialId);
    // Verifica se o usuário que fez a solicitação é o proprietário da credencial
    if (confirmUser.userId !== userId) {
        throw CONFLICT;
    }
    // Exclui a credencial do repositório
    
    await credentialRepository.deleteCredential(credentialId);
}

export const credentialService = {
    createCredential,
    credentialExists,
    getCredentials,
    findCredentialById,
    deleteCredential,
};