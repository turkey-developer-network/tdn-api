import * as nodemailer from "nodemailer";
import type { EmailPort, OtpEmailInput } from "@core/ports/email.port";
import type { FastifyBaseLogger } from "fastify";

export interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
}

export class NodemailerEmailService implements EmailPort {
    private transporter: nodemailer.Transporter;

    constructor(
        private readonly config: SmtpConfig,
        private readonly logger: FastifyBaseLogger,
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.config.host,
            port: this.config.port,
            secure: this.config.secure,
            auth: {
                user: this.config.user,
                pass: this.config.pass,
            },
        });
    }

    async sendVerificationEmail(input: OtpEmailInput): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: `"${this.config.from}" <${this.config.user}>`,
                to: input.to,
                subject: "E-posta Doğrulama Kodunuz (OTP)",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                        <h2 style="color: #333; text-align: center;">Hesabınızı Doğrulayın</h2>
                        <p style="color: #555; font-size: 16px;">Merhaba,</p>
                        <p style="color: #555; font-size: 16px;">İşleme devam edebilmek için tek kullanımlık doğrulama kodunuz aşağıdadır:</p>
                        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2c3e50;">${input.otp}</span>
                        </div>
                        <p style="color: #888; font-size: 14px; text-align: center;">Bu kod 10 dakika boyunca geçerlidir. Kodu kimseyle paylaşmayın.</p>
                    </div>
                `,
            });

            this.logger.info(
                "Verification email sent successfully via Nodemailer.",
            );
        } catch {
            this.logger.error(
                "Failed to send verification email via Nodemailer.",
            );
        }
    }

    async sendPasswordResetEmail(input: OtpEmailInput): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: `"${this.config.from}" <${this.config.user}>`,
                to: input.to,
                subject: "Şifre Sıfırlama İsteği",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                        <h2 style="color: #333; text-align: center;">Şifre Sıfırlama</h2>
                        <p style="color: #555; font-size: 16px;">Merhaba,</p>
                        <p style="color: #555; font-size: 16px;">İşleme devam edebilmek için tek kullanımlık doğrulama kodunuz aşağıdadır:</p>
                        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2c3e50;">${input.otp}</span>
                        </div>
                        <p style="color: #888; font-size: 14px; text-align: center;">Bu kod 10 dakika boyunca geçerlidir. Kodu kimseyle paylaşmayın.</p>
                    </div>
                `,
            });

            this.logger.info("Password reset email sent successfully.");
        } catch {
            this.logger.error("Failed to send password reset email.");
        }
    }
}
