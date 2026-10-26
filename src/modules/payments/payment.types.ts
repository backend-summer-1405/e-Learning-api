export type VerifyPaymentResult = {
  success: boolean;
  message: string;
  paymentId?: string;
  refId?: string;
};