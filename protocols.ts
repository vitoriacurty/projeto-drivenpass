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

export type CredentialEntity = {
    userId: number,
    url: string,
    username: string,
    password: string,
    title: string
}

export type CredentialUser = {
    userId: number
    url: string,
    username: string,
    encryptedPassword: string,
    title?: string
}

export type ApplicationError = {
    name: string;
    message: string;
};

export type RequestError = {
    status: number;
    data: object | null;
    statusText: string;
    name: string;
    message: string;
};

export type CredentialPost = Partial<CredentialEntity>