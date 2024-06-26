import { PaymentsModel } from 'src/models/Payment';

export const getTotalPrice = (data: PaymentsModel) => {
  return data.reduce((acumulator, iterable) => {
    return acumulator + parseFloat(iterable.price);
  }, 0);
};

export default {
  getTotalPrice,
};
