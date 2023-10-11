import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export function validateSchema(schema: Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
         // Verifica se o corpo da solicitação está vazio
        if (!req.body) {
            return res.status(400).send("Corpo da solicitação vazio.");
        }

        // Obtém o corpo da solicitação (dados do usuário)
        const user = req.body;

        // Valida os dados do usuário em relação ao esquema fornecido
        const validation = schema.validate(user, { abortEarly: false });

        // Se houver erros de validação, mapeia os detalhes dos erros
        if (validation.error) {
            const errors = validation.error.details.map((detail) => detail.message);
            return res.status(422).send(errors);
        }
        res.locals.user = user;

        next();
    };
}