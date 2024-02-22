import svgCaptcha from 'svg-captcha';
import sharp from 'sharp';

interface ICaptcha {
    captchaText: string;
    captcha: Buffer;
}

export default async function generateCaptcha(): Promise<ICaptcha> {
    const captcha = svgCaptcha.create({
        size: 7,
        color: true,
        background: "#ffffff",
        width: 500,
        height: 300
    });

    return <ICaptcha>{ 
        captchaText: captcha.text.toLowerCase(), 
        captcha: await sharp(Buffer.from(captcha.data))
            .jpeg()
            .toBuffer()
        };
}
