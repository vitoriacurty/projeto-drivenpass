export type AuthEntity = {
    email: string,
    password: string,
}

export type User = {
    id?: number,
    email: string,
    password: string,
}

export type AuthHash = {
    email: string,
    hashPassword: string,
}

export type SignUp = {
    id?: string;
    email: string;
    password: string;
}