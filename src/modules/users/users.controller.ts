import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersFiltersDto } from './dto/query/users-filters.dto';
import { IdParamDto } from 'src/global/dto/id-param.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/global/decorators/roles.decorator';
import { RolesEnum } from './enums/roles.enum';

@Roles(RolesEnum.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() queryFilters: UsersFiltersDto) {
    return this.usersService.findAll(queryFilters);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: IdParamDto, @Body() updateRoleDto: UpdateRoleDto) {
    return this.usersService.update(id, updateRoleDto);
  }
}
