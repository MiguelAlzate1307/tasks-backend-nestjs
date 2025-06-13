import { isDate } from './is-date.util';

export const isTwoDatesArray = (value: any) =>
  value instanceof Array && value.every((e) => isDate(e)) && value.length === 2;
