import { BAD_REQUEST, NOT_FOUND } from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthEntity } from "../../protocols";
import authRepository from "./../repositories/auth-repository"

async function signUp(auth: AuthEntity) {
  // Extrai o email e a senha da entidade de autenticação
  const { email, password } = auth;

  // Verifica se o email já existe no banco de dados
  await emailExists(email);

  // Gera um hash da senha do usuário
  const hashPassword = bcrypt.hashSync(password, 12);

  // Insere o usuário no banco de dados
  await authRepository.insertUser(email, hashPassword);
}

async function signIn(email: string, password: string) {
  // Procura o usuário com o email fornecido no banco de dados
  const user = await authRepository.findEmail(email);

  // Se o usuário não existe, lança um erro "NOT_FOUND"
  if (!user) {
    throw NOT_FOUND;
  }

  // Compara a senha fornecida com a senha armazenada no banco de dados
  const correctPassword = bcrypt.compareSync(password, user.password);

  // Se as senhas não coincidem, lança um erro "BAD_REQUEST"
  if (!correctPassword) {
    throw BAD_REQUEST;
  }

  // Cria um token de sessão para o usuário
  const token = await createSession(user.id);
  return { token };
}

async function emailExists(email: string) {
  // Procura o email no banco de dados
  const user = await authRepository.findEmail(email);

  // Se o email já existe, lança um erro "BAD_REQUEST"
  if (user) {
    throw BAD_REQUEST;
  }
  return user;
}

async function createSession(userId: number) {
  // Obtém a chave secreta para assinar o token JWT a partir de variáveis de ambiente
  const secretKey = process.env.JWT_SECRET;

  // Cria um token JWT com o ID do usuário e uma expiração de 24 horas
  const token = jwt.sign({ userId }, secretKey, { expiresIn: 86400 });

  return token;
}

const authService = {
  signUp,
  emailExists,
  signIn,
};

export default authService;