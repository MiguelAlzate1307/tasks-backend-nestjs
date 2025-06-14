import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';
import { TokenPayload } from '../auth/models/token-payload.model';
import { TasksFiltersDto } from './dto/query/tasks-filters.dto';
import { IdParamDto } from 'src/global/dto/id-param.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    return this.tasksService.create(createTaskDto, req.user as TokenPayload);
  }

  @Get()
  findAll(@Query() queryFilters: TasksFiltersDto) {
    return this.tasksService.findAll(queryFilters);
  }

  @Get(':id')
  findOne(@Param() { id }: IdParamDto, @Req() req: Request) {
    return this.tasksService.findOne(id, req.user as TokenPayload);
  }

  @Patch(':id')
  update(
    @Param() { id }: IdParamDto,
    @Req() req: Request,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      id,
      updateTaskDto,
      req.user as TokenPayload,
    );
  }

  @Delete(':id')
  remove(@Param() { id }: IdParamDto, @Req() req: Request) {
    return this.tasksService.remove(id, req.user as TokenPayload);
  }
}
