export interface PaymentModel {
  description: string;
  date: string;
  price: number;
  userId?: string;
}

export type PaymentsModel = Array<PaymentModel>;
