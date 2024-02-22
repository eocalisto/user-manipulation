import mongoose from "mongoose";
import { v4 } from "uuid";

interface IToken {
    token: string;
    isValid: boolean;
}

type TokenModel = mongoose.Model<IToken, {}>

const TokenSchema = new mongoose.Schema<IToken>({
    token: { type: String, required: true, unique: true },
    isValid: { type: Boolean, required: true },
})

export default mongoose.model<IToken, TokenModel>('Token', TokenSchema, 'Token');