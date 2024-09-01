export function getFormattedMonth(month) {
  return month < 10 ? '0' + month : month;
}

export function getLastDate(month) {
  const date = new Date();
  date.setMonth(month);
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDate.getDate();
}
