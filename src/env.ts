import { config } from "dotenv";

/**
 * Configurar as variáveis de ambiente para o arquivo `.env` na raiz
 * do projeto.
 */
config()

export const mongoDb = process.env.MONGODB!;

/* Chave JWT para os tokens de verificação */
export const verifiedKey = process.env.VERIFIEDKEY!;

/* Chave JWT para os tokens de autenticação */
export const tokenKey = process.env.TOKENKEY!;

/* Email do transporter, em `src\utilities\serviceEmail.ts` */
export const host = process.env.HOST!;

/* Senha do transporter, em `src\utilities\serviceEmail.ts` */
export const pass = process.env.PASS!;

export const port = ((): string => {
    /* Converte para número. */
    const portNumber = Number(process.env.PORT ?? '3000');

    /* Verifica se a porta é um número. */
    if (isNaN(portNumber)) {
        throw new Error('Porta para servidor inválida.');
    }
    return portNumber.toString();
})();
