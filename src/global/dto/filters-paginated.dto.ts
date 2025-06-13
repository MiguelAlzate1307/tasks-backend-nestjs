import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { SelectQueryBuilder } from 'typeorm';
import { OrderCriteriaEnum } from '../enums/order-criteria.enum';
import { IsDateOrTwoDatesArray } from '../utils/validators/is-date-or-two-dates-array.validator';
import { isDate } from '../utils/is-date.util';
import { isTwoDatesArray } from '../utils/is-two-dates-array.validator';

export abstract class FiltersPaginatedDto {
  abstract orderCriteria?: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  page?: number;

  @Validate(IsDateOrTwoDatesArray)
  @IsOptional()
  created_at?: string | string[];

  @Validate(IsDateOrTwoDatesArray)
  @IsOptional()
  updated_at: string | string[];
}

export const getResponsePaginated = async (
  query: SelectQueryBuilder<any>,
  {
    orderCriteria = OrderCriteriaEnum.CREATED_AT,
    order = 'ASC',
    limit = 10,
    page = 1,
    ...filters
  }: FiltersPaginatedDto,
) => {
  const alias = query.alias;

  for (const [key, value] of Object.entries(filters)) {
    if (
      typeof value === 'string' &&
      !key.includes('Enum') &&
      !key.includes('id') &&
      !isDate(value)
    )
      query.andWhere(`LOWER(${alias}.${key}) ILIKE LOWER(:${key})`, {
        [key]: `%${value}%`,
      });
    else if (isTwoDatesArray(value))
      query.andWhere(
        `DATE(${alias}.${key}) BETWEEN :firstValue AND :secondValue`,
        {
          firstValue: value[0],
          secondValue: value[1],
        },
      );
    else if (isDate(value))
      query.andWhere(`DATE(${alias}.${key}) = :${key}`, {
        [key]: value,
      });
    else {
      const newKey = key.replace(/([E-e]num|for_)/g, '');

      query.andWhere(`${alias}.${newKey} = :${newKey}`, {
        [newKey]: value,
      });
    }
  }

  query.orderBy(orderCriteria, order);

  query.take(limit);
  query.skip((page - 1) * limit);

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    total,
    limit,
    page,
  };
};
