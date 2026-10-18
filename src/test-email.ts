import "dotenv/config";
import { sendPasswordResetEmail } from "./utils/email.js";

try {
  await sendPasswordResetEmail(
    "mani.darvish2020@gmail.com",  
    "http://localhost:5173/reset-password?token=test-token-123"
  );
  console.log("✅ Email sent successfully!");
} catch (error) {
  console.error("Failed to send email:", error);
  process.exitCode = 1;
}