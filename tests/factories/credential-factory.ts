import { PrismaClient, User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const cryptr = new Cryptr(process.env.CRYPTR);

export async function createCredential(userId: number) {
    const password = cryptr.encrypt(faker.internet.password({ length: 10 }))
    return prisma.credential.create({
        data: {
            title: faker.person.firstName(),
            url: faker.internet.url(),
            username: faker.internet.userName(),
            password: password,
            userId
        }
    })
}

export async function generateValidToken(user: User) {
    const token = jwt.sign({ userId: Number(user.id) }, process.env.JWT_SECRET);
    return token;
}

export const generateValidBody = () => ({
    id: 1,
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
});
