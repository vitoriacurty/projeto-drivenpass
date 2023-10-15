import app from "app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { PrismaClient } from "@prisma/client";
import { userCreated } from "../factories/auth-factory";
import { generateValidBody, generateValidToken, createCredential } from "../factories/credential-factory";

const prisma = new PrismaClient();

beforeEach(async () => {
    await prisma.credential.deleteMany({});
    await prisma.user.deleteMany({});
});

afterAll(async () => {
    await prisma.credential.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
});

const server = supertest(app);

describe("POST /credential", () => {
    it("When invalid body", async () => {
        const result = await server.post("/credential");
        expect(result.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("Valid token is passed", () => {
        const createCredential = () => ({
            title: faker.person.firstName(),
            url: faker.internet.url(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        });

        it("Valid token is passed but body doesnot send should respond 422", async () => {
            const user = await generateValidBody();
            const token = await generateValidToken(user);
            const result = await server
                .post("/credential")
                .set("Authorization", `Bearer ${token}`);
            expect(result.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
        it("Valid token is passed, in the wrong format result 404", async () => {
            const user = await generateValidBody();
            const body = {
                title: faker.person.firstName(),
                url: faker.internet.url(),
                username: faker.internet.userName(),
                password: faker.internet.password(),
            };
            const token = await generateValidToken(user);
            const result = await server
                .post("/credential")
                .set("Authorization", `Bearer ${token}`)
                .send(body);
            expect(result.status).toBe(httpStatus.NOT_FOUND);
        });

        it("Valid token and body should respond 201", async () => {
            const userBody = generateValidBody();
            const user = await userCreated(userBody);
            const body = await createCredential();
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
            expect(result.status).toBe(httpStatus.CREATED);
        });
        it("Credential with the same name", async () => {
            const userBody = generateValidBody();
            const user = await userCreated(userBody);
            const credential = await createCredential();

            // Verifica se uma credencial com o mesmo nome já existe
            const existingCredential = await prisma.credential.findMany({
                where: {
                    title: credential.title,
                },
            });

            const token = await generateValidToken({
                id: user.id,
                email: user.email,
                password: userBody.password,
            });

            await server
                .post("/credential")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: credential.title,
                    url: credential.url,
                    username: credential.username,
                    password: credential.password,
                });
            // Se uma credencial com o mesmo nome já existe, retorna um código de status 409 (Conflito)
            const result = await server
                .post("/credential")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: credential.title,
                    url: credential.url,
                    username: credential.username,
                    password: credential.password,
                });

            expect(result.status).toBe(httpStatus.UNAUTHORIZED);

        });
    })


    describe("GET /credential", () => {
        const createCredential = () => ({
            title: faker.person.firstName(),
            url: faker.internet.url(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        });


        describe("Right token is passed", () => {
            it("Credential were previosly inserted to this user", async () => {
                const userBody = generateValidBody();
                const user = await userCreated(userBody);
                const token = await generateValidToken({
                    id: user.id,
                    email: user.email,
                    password: user.password,
                });
                const body = await createCredential();
                await createCredential();
                const response = await server
                    .get("/credential")
                    .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(httpStatus.OK);
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            title: expect.any(String),
                            url: expect.any(String),
                            username: expect.any(String),
                            password: expect.any(String),
                        }),
                    ])
                );
            });
        });
    });

    describe("GET /credential/:id", () => {
        const createCredential = () => ({
            // id: faker.datatype.uuid(),
            title: faker.person.firstName(),
            url: faker.internet.url(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        });

        it("No token is provided should respond 401", async () => {
            const result = await server.get("/credential/1");
            expect(result.status).toBe(httpStatus.UNAUTHORIZED);
        });
        it("Wrong token is provided should respond 401", async () => {
            const token = "XXXXXXX";
            const result = await server
                .get("/credential/1")
                .set("Authorization", `Bearer ${token}`);
            expect(result.status).toBe(httpStatus.UNAUTHORIZED);
        });
        describe("Right token is provided", () => {
            it("Succesfull request made", async () => {
                const body = await createCredential();
                const userBody = generateValidBody();
                const user = await userCreated(userBody);
                const token = await generateValidToken({
                    id: user.id,
                    email: user.email,
                    password: user.password,
                });
                const credential = await createCredential();
                const result = await server
                    .get(`/credential/${credential?.username}`)
                    .set("Authorization", `Bearer ${token}`);

                expect(result.status).toBe(httpStatus.OK);
                expect(result.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        title: expect.any(String),
                        username: expect.any(String),
                        password: expect.any(String),
                        userId: expect.any(Number),
                    })
                );
            });
        });
    });

    describe("DELETE /credential/:id", () => {
        const createCredential = () => ({
            // id: faker.datatype.uuid(),
            title: faker.person.firstName(),
            url: faker.internet.url(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        });

        it("No token is provided, should respond 401", async () => {
            const result = await server.delete("/credential/1");
            expect(result.status).toBe(httpStatus.UNAUTHORIZED);
        });
        it("Wrong token is provided, should respond 401", async () => {
            const token = "123456";
            const result = await server
                .delete("/credential/1")
                .set("Authorization", `Bearer ${token}`);
            expect(result.status).toBe(httpStatus.UNAUTHORIZED);
        });
        describe("Valid token is passed", () => {
            it("Not a valid id passed", async () => {
                const user = generateValidBody();
                const body = createCredential();
                const token = await generateValidToken(user);
                const randoNumber = faker.number.int(3);
                const result = await server
                    .delete(`/credential/${randoNumber}`)
                    .set("Authorization", `Bearer ${token}`);
                expect(result.status).toBe(httpStatus.NOT_FOUND);
            });
            it("Valid id is passed", async () => {
                const body = await createCredential();
                const userBody = generateValidBody();
                const user = await userCreated(userBody);
                const token = await generateValidToken({
                    id: user.id,
                    email: user.email,
                    password: user.password,
                });
                const credential = await createCredential();

                const result = await server
                    .delete(`/credential/${credential?.username}`)
                    .set("Authorization", `Bearer ${token}`);
                expect(result.status).toBe(httpStatus.NO_CONTENT);
            });
        });
    });
})