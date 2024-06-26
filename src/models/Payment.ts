export interface PaymentModel {
  description: string;
  date: string;
  price: string;
  userId?: string;
}

export type PaymentsModel = Array<PaymentModel>;
