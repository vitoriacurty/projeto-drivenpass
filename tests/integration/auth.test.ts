import app from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { PrismaClient } from "@prisma/client";
import { userCreated } from "../factories/auth-factory";

const prisma = new PrismaClient()

beforeEach(async () => {
    await prisma.credential.deleteMany({});
    await prisma.user.deleteMany({});
});

afterAll(async () => {
    await prisma.credential.deleteMany({});
    await prisma.user.deleteMany({});
});

const server = supertest(app);

describe("POST /signin", () => {
    const generateBody = () => ({
        email: faker.internet.email(),
        password: faker.internet.password({length: 10}),
    });
    it('should respond with status 400 if email and/or password is invalid ', async () => {
        const response = await server.post('/signin');
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond with status 404 if user email does not exist', async () => {
        const user = {
            email: 'emailcorreto@email.com',
            password: faker.internet.password({ length: 10 }),
        }
        const response = await server.post('/signin').send({ email: 'emailincorreto@email.com', password: user.password });
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 401 if password does not match user register', async () => {
        const body = generateBody();

        const user = await userCreated(body);
        const response = await server.post('/signin').send({ email: user.email, password: faker.internet.password({ length: 10 }) });
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 200 if login is sucessful', async () => {
        const user = {
            email: 'emailcorreto@email.com',
            password: faker.internet.password({ length: 10 }),
        }
        await server.post('/signup').send({ email: user.email, password: user.password });
        const response = await server.post('/signin').send({ email: user.email, password: user.password });
        expect(response.status).toBe(httpStatus.OK);
    });
});

describe("POST /signup", () => {
    it("should respond with status 422 when invalid body", async () => {
        const result = await server.post("/signup");
        expect(result.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("when body is valid", () => {
        const generateBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
        });

        it("should respond with status 409 if email already is in use", async () => {
            const body = generateBody();
            await userCreated(body);
            const response = await server.post("/signup").send(body);

            expect(response.status).toBe(httpStatus.CONFLICT);
        });

        describe("when credentials are valid", () => {
            it("should respond with status 200", async () => {
                const body = { email: "vit@gmail.com", password: "123456789123" };
                const response = await server.post("/signup").send(body);

                expect(response.status).toBe(httpStatus.CREATED);
            });
        });
    });
});