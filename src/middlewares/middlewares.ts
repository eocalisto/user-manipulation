import { Response, Request, RequestHandler, NextFunction } from "express";
import User from "../models/User/User";
import * as errors from "../utilities/errors";
import Code from "../models/Code/Code";
import { createToken } from "../helpers/auth/auth";

export function resolver(handlerFn: RequestHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(handlerFn(req, res, next))
            .catch(e => next(e))
    }
}

export async function register(req: Request, res: Response) {
    const { username, cpf, email, password, birth } = req.body;

    if (await User.findOne({ email })) {
        throw new errors.EmailAlreadyRegistered();
    }

    if (await Code.findOne({ email })) {
        await Code.deleteOne({ email });
    }

    const user = new User({ username, email, password, cpf, birth: new Date(birth) });
    const code = new Code({ associatedEmail: user.email, associatedId: user._id, ip: req.body });

    await code.generateCode(req.ip, email);

    await user.save();

    return res.send({ message: "Usuário registrado. Solicite um código de verificação!", id: user._id });
};

export async function askCode(req: Request, res: Response) {
    const code = await Code.findOne({ 
        $or: [
            { associatedId: req.params.id },
            { associatedEmail: req.params.email }
        ]
    });
    
    if (code) {
        const captcha = await code.generateCode(req.ip, req.params.email);
        return res.status(captcha.status ?? 200).send(captcha.message)
    } else {
        throw new errors.UserNotFound();
    }
};

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && await user.passwordChecking(password)) {
        return res.send({ message: "Login realizado com sucesso.", auth: createToken({
            email, createdAt: new Date(Date.now()),
            id: user._id
        }) })
    } else {
        throw new errors.InvalidCredencials();
    }
}


export async function checkCode(req: Request, res: Response) {
    const { code, email, id } = req.body;

    const user = await User.findOne({
        $or: [
            { _id: id },
            { email }
        ]
    })

    if (user && !user.isVerified) {
        const originalCode = await Code.findOne({ 
            $or: [
                { associatedId: id },
                { associatedEmail: email }
            ]
        });
        
        if (await originalCode?.checkCode(code)) {
            await user.insertVerified();

            await Code.deleteOne({ 
                $or: [
                    { associatedId: id },
                    { associatedEmail: email }
                ]
            })
            
            return res.send({ message: "Autenticação realizada!"})
        } else {
            throw new errors.InvalidCode();
        }
    } else {
        throw new errors.ActionNotAllowed();
    }
}