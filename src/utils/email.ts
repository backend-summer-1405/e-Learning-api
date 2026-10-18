import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (
  to: string,
  resetLink: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>بازیابی رمز عبور</h2>
      <p>برای تنظیم رمز عبور جدید، روی دکمه زیر کلیک کنید:</p>
      <a href="${resetLink}" 
         style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        تنظیم رمز عبور جدید
      </a>
      <p style="color: #666; font-size: 14px;">این لینک تا ۱ ساعت دیگه منقضی می‌شه.</p>
      <p style="color: #666; font-size: 14px;">اگه شما این درخواست رو نداده‌اید، این ایمیل رو نادیده بگیرید.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"E-Learning" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: "بازیابی رمز عبور",
    html,
  });
};