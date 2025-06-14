import { FiltersPaginatedDto } from 'src/global/dto/filters-paginated.dto';
import { TasksFieldsEnum } from '../../enums/tasks-fields.enum';
import { OrderCriteriaEnum } from 'src/global/enums/order-criteria.enum';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { castEnumsToArray } from 'src/global/utils/cast-enums-to-array.util';

export class TasksFiltersDto extends FiltersPaginatedDto {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @IsIn(castEnumsToArray(TasksFieldsEnum, OrderCriteriaEnum))
  orderCriteria?: TasksFieldsEnum | OrderCriteriaEnum;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  title?: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  description?: string;

  @IsBoolean()
  @Transform(({ value }: { value: string }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsOptional()
  done?: string | boolean;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  @IsUUID()
  for_user_id: string;
}
