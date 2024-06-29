export const formatBRMoney = (value: number) => {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export default {
  formatBRMoney,
};
