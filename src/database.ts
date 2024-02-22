import mongoose from "mongoose";
import * as env from './env'

const db = (async (mongoUrl: String | null = null): Promise<typeof mongoose | void> => {
    if (!env.mongoDb || typeof env.mongoDb !== 'string' && !mongoUrl) {
        throw new Error('Link do MongoDB está em um formato incorreto ou é nulo.')
    }

    /* Código para estabelecer conexão com o banco de dados.*/
    return await mongoose.connect(env.mongoDb ?? mongoUrl, { /* Opções de conexão. */ })
        .then(() => console.log(`Database On`))
        .catch((err) => console.error(`Database Off: ${err}`))
});

export default db;