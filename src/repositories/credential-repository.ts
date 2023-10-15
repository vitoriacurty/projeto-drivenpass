import { CredentialUser } from "../../protocols";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// encontra uma credencial com base no título
async function findUser(title: string) {
    // Consulta o banco de dados para encontrar uma credencial com o título fornecido
    const getUser = await prisma.credential.findFirst({
        where: {
            title
        }
    })

    return getUser
}

// cria uma nova credencial
async function createCredential(credential: CredentialUser) {
    // Cria um novo registro de credencial com os dados fornecidos
    return prisma.credential.create({
        data: {
            userId: credential.userId,
            title: credential.title,
            username: credential.username,
            url: credential.url,
            password: credential.encryptedPassword
        }
    })
}

// obter as credenciais de um usuário
async function getCredentials(userId: number) {
    // Consulta o banco de dados para obter todas as credenciais de um usuário
    const getUserCredentials = await prisma.credential.findMany({
        where: {
            userId
        }
    })

    return getUserCredentials
}

// confirma uma credencial com base no ID
async function confirmUser(credentailId: number) {
    const user = await prisma.credential.findFirst({
        where: {
            id: credentailId
        }
    })

    return user
}

// exclui uma credencial com base no ID
async function deleteCredential(credentailId: number) {
    // Exclui a credencial do banco de dados com base no ID fornecido
    const deleting = await prisma.credential.delete({
        where: {
            id: credentailId
        }
    })

    return deleting
}

export const credentialRepository = {
    findUser,
    createCredential,
    getCredentials,
    confirmUser,
    deleteCredential
}




















// import { CredentialUser } from "@/../protocols";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient()

// async function createCredential(credential: CredentialUser) {
//     return prisma.credential.create({
//         data: credential,
//         select: {
//             id: true,
//             title: true,
//             url: true,
//             username: true,
//             password: true,
//             userId: true
//         }
//     });
// }

// async function findByTitle(title: string) {
//     return prisma.credential.findFirst({
//         where: { title }
//     })
// }

// async function findAll(userId: number) {
//     return prisma.credential.findMany({
//         where: { userId }
//     });
// }

// async function findById(id: number, userId: number) {
//     return prisma.credential.findFirst({
//         where: { id, userId }
//     })
// }

// async function deleteCredential(id: number) {
//     return prisma.credential.delete({
//         where: { id }
//     })
// }

// export const credentialRepository = {
//     create,
//     findByTitle,
//     findAll,
//     findById,
//     deleteCredential
// };