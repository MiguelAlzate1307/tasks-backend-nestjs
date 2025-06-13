import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { RolesEnum } from '../enums/roles.enum';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @IsEnum(RolesEnum)
  role?: RolesEnum;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MaxLength(60)
  refresh_token?: string;
}
