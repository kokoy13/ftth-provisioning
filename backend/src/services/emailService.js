const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: parseInt(process.env.MAIL_PORT || "587") === 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const EmailService = {
    async sendResetPassword(to, resetLink) {
        const mailOptions = {
        from: `"FTTH Provisioning" <${process.env.MAIL_FROM}>`,
        to,
        subject: "Reset Password – FTTH Provisioning",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #f9fafb; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #1e293b; margin: 0;">🔐 Reset Password</h2>
            </div>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                Anda menerima email ini karena ada permintaan reset password untuk akun Anda.
            </p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                Klik tombol di bawah ini untuk mereset password Anda. Link ini berlaku selama <strong>15 menit</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
                <a
                href="${resetLink}"
                style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;"
                >
                Reset Password
                </a>
            </div>
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                Jika Anda tidak meminta reset password, abaikan email ini.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                FTTH Provisioning & Monitoring System
            </p>
            </div>
        `,
        };

        await transporter.sendMail(mailOptions);
    },
};

module.exports = EmailService;
