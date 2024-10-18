// extract YYY/MM/DD from date
export const getYYYYMMDD = (date: Date): Date => {
  return new Date(date.toString().split('T')[0]);
};

// add a day from getYYYYMMDD date
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};
