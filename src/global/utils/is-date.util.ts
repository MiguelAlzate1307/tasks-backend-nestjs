export const isDate = (value: any) =>
  typeof value === 'string' && !isNaN(Date.parse(value));
