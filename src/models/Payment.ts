export interface PaymentModel {
  description: string;
  date: string;
  price: string;
  userId?: string;
  observation?: string;
  paymentId?: string;
}

export type PaymentsModel = Array<PaymentModel>;
