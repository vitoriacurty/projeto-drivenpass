import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findEmail(email: string) {
  // Consulta o banco de dados para encontrar um usuário com o email fornecido
  const existUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  return existUser;
}

async function insertUser(email: string, hashPassword: string) {
  // Cria um novo registro de usuário com o email e senha fornecidos
  await prisma.user.create({
    data: {
      email,
      password: hashPassword,
    },
  });
}

async function findUser(userData: number) {
  // Consulta o banco de dados para encontrar um usuário com o ID fornecido
  const user = await prisma.user.findFirst({
    where: {
      id: userData,
    },
  });

  return user;
}

const authRepository = {
  findEmail,
  insertUser,
  findUser,
};

export default authRepository;
