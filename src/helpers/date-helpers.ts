enum IFormatDate {
  BACK_SLASH_FORMAT,
  TRACES_FORMAT,
}

export const getCurrentDateSplit = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');

  return { year, month };
};

export const splitDateFromParameter = (date: string) => {
  const dateSplited = date.split('-');
  const year = dateSplited[0];
  const month = dateSplited[1];
  const day = dateSplited[2];

  return { year, month, day };
};

export const maskDate = (date: string, format: IFormatDate) => {
  const parts = date.split('-');
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  let dateFormated = '';

  if (format === IFormatDate.BACK_SLASH_FORMAT) {
    dateFormated = `${day}/${month}/${year}`;
  }

  if (format === IFormatDate.TRACES_FORMAT) {
    dateFormated = `${day}-${month}-${year}`;
  }

  return dateFormated;
};

export default {
  getCurrentDateSplit,
  splitDateFromParameter,
  maskDate,
  IFormatDate,
};
