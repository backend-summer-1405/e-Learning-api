import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

if (!smtpUser || !smtpPass) {
  throw new Error("SMTP_USER and SMTP_PASS must be configured");
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export const sendPasswordResetEmail = async (
  to: string,
  resetLink: string
): Promise<void> => {
  await transporter.sendMail({
    from: `"E-Learning" <${smtpFrom}>`,
    to,
    subject: "بازیابی رمز عبور",
    text: `
سلام،

برای تنظیم رمز عبور جدید، لینک زیر را باز کنید:

${resetLink}

این لینک تا یک ساعت معتبر است.

اگر شما درخواست بازیابی رمز عبور نداده‌اید، این ایمیل را نادیده بگیرید.

تیم support-site
    `.trim(),
  });
};

export const verifyEmailConnection = async (): Promise<void> => {
  await transporter.verify();
};