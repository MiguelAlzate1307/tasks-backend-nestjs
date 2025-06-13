import { FiltersPaginatedDto } from 'src/global/dto/filters-paginated.dto';
import { UsersFieldsEnum } from '../../enums/users-fields.enum';
import { OrderCriteriaEnum } from 'src/global/enums/order-criteria.enum';
import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { castEnumsToArray } from 'src/global/utils/cast-enums-to-array.util';
import { RolesEnum } from '../../enums/roles.enum';

export class UsersFiltersDto extends FiltersPaginatedDto {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @IsIn(castEnumsToArray(UsersFieldsEnum, OrderCriteriaEnum))
  orderCriteria?: UsersFieldsEnum | OrderCriteriaEnum;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(30)
  name?: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(30)
  username?: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(50)
  email?: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @IsEnum(RolesEnum)
  roleEnum?: RolesEnum;
}
