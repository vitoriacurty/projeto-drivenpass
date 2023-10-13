import bcrypt from "bcrypt"
import { User } from "../../protocols";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function userCreated(body: User) {
    const hashedPassword = bcrypt.hashSync(body.password, 10)
    return await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword
      },
    });
}