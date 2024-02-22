import nodemailer from 'nodemailer';
import { host, pass } from '../env';

class ServiceEmail {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: host,
                pass: pass
            }
        });
    };

    async sendEmail(email: string, imgCaptcha: Buffer) {
        const base64Image = imgCaptcha.toString('base64');
        const mailOptions = {
            from: process.env.HOST,
            to: email,
            subject: "Olá! Aqui está seu código de verificação.",
            html: `<p>Olá,</p>
                   <p>Aqui está o seu código de verificação!</p>
                   <p>Atenciosamente, Prisma Team</p>`,
            attachments: [
                {
                    filename: 'captcha.png',
                    content: imgCaptcha,
                    contentType: 'image/png'
                }
            ],
        }
    
        await this.transporter.sendMail(mailOptions);
    }
}

export default ServiceEmail;