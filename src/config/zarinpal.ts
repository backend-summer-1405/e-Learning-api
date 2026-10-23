import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const ZarinpalPayment = require("zarinpal-pay");

const zarinpal = new ZarinpalPayment(
  process.env.ZARINPAL_MERCHANT_ID || "eaa46b01-819e-42ef-8a67-ba2bb7f69a32",
  {
    isSandbox: true,
    isToman: true,
  }
);

export default zarinpal;