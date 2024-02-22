import mongoose from "mongoose";
import { v4 } from "uuid";
import * as bcrypt from 'bcrypt';
import { cpfRegex, emailRegex, passwordRegex } from "../../regex";
import * as errors from "../../utilities/errors";
import * as jwt from "jsonwebtoken";
import { IVerifiedObj } from "./InterfaceVerified";
import { verifiedKey } from "../../env";

interface IUser {
    _id: string;

    username: string;
    cpf: string;
    email: string;
    password: string;
    birth: Date;

    createdAt: Date;
    isVerified: string | undefined;
}

interface IUserMethods {
    insertVerified(): Promise<null>;
    passwordChecking(password: string): Promise<Boolean>;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>

const UserSchema = new mongoose.Schema<IUser>({
    _id: { type: String, required: true, default: () => v4() },
    username: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birth: { type: Date, required: true },
    createdAt: { type: Date, required: true, default: () => Date.now() },
    isVerified: { type: String || undefined, default: undefined }
})

UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        if (passwordRegex.test(this.password)) {
            const password = await bcrypt.hash(this.password, 10);
            this.password = password;
        } else if (this.password.length < 6) {
            throw new errors.PasswordTooSmall();
        } else {
            throw new errors.PasswordNotValid();
        }
    }

    if (this.isModified('email')) {
        if (emailRegex.test(this.email)) {
            next();
        } else {
            throw new errors.EmailNotValid();
        }
    }

    if (this.isModified('cpf') ) {
        if (cpfRegex.test(this.cpf)) {
            next();
        } else {
            throw new errors.InvalidCPF();
        }
    }

    next();
})

UserSchema.method('insertVerified', async function() {
    this.isVerified = jwt.sign(
        <IVerifiedObj>{ email: this.email, verified: true }, 
        verifiedKey
    );
    await this.save();
});

UserSchema.method('passwordChecking', async function(password: string) {
    const isMatch = await bcrypt.compare(password, this.password);
    if (isMatch) return true;
    else return false;
});

export default mongoose.model<IUser, UserModel>('Users', UserSchema, 'Users')