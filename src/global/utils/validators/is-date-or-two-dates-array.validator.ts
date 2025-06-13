import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isDate } from '../is-date.util';
import { isTwoDatesArray } from '../is-two-dates-array.validator';

@ValidatorConstraint({ name: 'IsDateOrTwoDatesArray', async: false })
export class IsDateOrTwoDatesArray implements ValidatorConstraintInterface {
  validate(value: any): Promise<boolean> | boolean {
    if (isDate(value) || isTwoDatesArray(value)) return true;

    return false;
  }

  defaultMessage({ property }: ValidationArguments): string {
    return `${property} must be a date or a two dates array`;
  }
}
