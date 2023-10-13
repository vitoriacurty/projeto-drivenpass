import app from "app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { PrismaClient } from "@prisma/client";
import { createCredential, generateValidBody, generateValidToken } from "../factories/credential-factory";
import { userCreated } from "../factories/auth-factory";

const prisma = new PrismaClient();

beforeEach(async () => {
    await prisma.credential.deleteMany({});
    await prisma.user.deleteMany({});
});

afterAll(async () => {
    await prisma.credential.deleteMany({});
    await prisma.user.deleteMany({});
});

const server = supertest(app);

describe("POST /credential", () => {
    // it("When invalid body", async () => {
    //     const result = await server.post("/credential");
    //     expect(result.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    // });

    describe("Valid token is passed", () => {
        const generateCredential = () => ({
            title: faker.person.firstName(),
            url: faker.internet.url(),
            username: faker.internet.userName(),
            password: faker.internet.url(),
        });

        it("Valid token and body should respond 200", async () => {
            const userBody = generateValidBody();
            const user = await userCreated(userBody);
            const body = generateCredential();
            const token = await generateValidToken({
                id: user.id,
                email: user.email,
                password: user.password,
            });
            console.log(token);
            const result = await server
                .post("/credential")
                .set("Authorization", `Bearer ${token}`)
                .send(body);
            expect(result.status).toBe(httpStatus.OK);
        });
    });
 });

describe("GET /credential", () => {
    const generateCredential = () => ({
        title: faker.person.firstName(),
        url: faker.internet.url(),
        username: faker.internet.userName(),
        password: faker.internet.url(),
    });
});

describe("GET /credential/:id", () => {
    const generateCredential = () => ({
        title: faker.person.firstName(),
        url: faker.internet.url(),
        username: faker.internet.userName(),
        password: faker.internet.url(),
    });

    it("should respond 401 if no token is provided", async () => {
        const result = await server.get("/credential/1");
        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond 401 if wrong token is provided ", async () => {
        const token = "XXXXXXX";
        const result = await server
            .get("/credential/1")
            .set("Authorization", `Bearer ${token}`);
        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
});