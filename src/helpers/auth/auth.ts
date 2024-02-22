import * as jwt from 'jsonwebtoken';
import { tokenKey } from '../../env';
import Token from '../../models/Tokens/Tokens';

interface IPayloadToken {
    email: string;
    id: string;
    createdAt: Date;
}

export function createToken(payload: IPayloadToken): string {
    return jwt.sign(payload, tokenKey, { expiresIn: '1w' });
}

export async function isValidToken(token: string): Promise<Boolean> {
    const existsToken = await Token.findOne({ token });
    if (existsToken && existsToken.isValid) {
        try {
            jwt.verify(existsToken.token, tokenKey);
            return true;
        } catch (error) {
            await Token.deleteOne({ token: existsToken.token });
            return false;
        }
    } else {
        return false;
    }
}

export function decryptToken(token: string): IPayloadToken {
    return jwt.verify(token, tokenKey) as IPayloadToken;
}