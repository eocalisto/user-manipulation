import mongoose from "mongoose";
import crypto from 'crypto';
import { IAttempt } from "./InterfaceAttempt";
import generateCaptcha from "../../utilities/generateCaptcha";
import ServiceEmail from "../../utilities/serviceEmail";
import { GenerateCodeResult } from "./GenerateCodeResult";

const service = new ServiceEmail();

interface ICode {
    _id: string;

    associatedId: string;
    associatedEmail: string;
    code: string;

    ip: string | undefined;
    dateLimit: Date | undefined;
    attempts: Array<IAttempt>;
}

interface ICodeMethods {
    checkCode(code: string): Promise<Boolean>;
    generateCode(ip: string | undefined, email: string): Promise<GenerateCodeResult>;
}

type CodeModel = mongoose.Model<ICode, {}, ICodeMethods>;

const CodeSchema = new mongoose.Schema<ICode>({
    _id: { type: String, required: true, default: () => crypto.randomBytes(16).toString('hex') },
    associatedId: { type: String, required: true, unique: true },
    associatedEmail: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    ip: { type: String || undefined, required: true },
    dateLimit: { type: Date, default: null },
    attempts: { type: Array(Object), required: true }
});

CodeSchema.method('checkCode', async function(code: string) {
    if (this.code === code.toLowerCase()) return true;
    else return false;
});

CodeSchema.method('generateCode', async function(ip: string | undefined, email: string) {
    const captcha = await generateCaptcha();

    await service.sendEmail(email, captcha.captcha);

    this.code = captcha.captchaText;
    this.ip = ip;

    await this.save();

    return { message: "Código enviado! Verifique sua caixa de Email." };
});

export default mongoose.model<ICode, CodeModel>('Code', CodeSchema, 'Codes')