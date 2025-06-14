import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../auth/models/token-payload.model';
import { TasksFiltersDto } from './dto/query/tasks-filters.dto';
import { getResponsePaginated } from 'src/global/dto/filters-paginated.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRep: Repository<Task>,
    private readonly usersSer: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto, { id }: TokenPayload) {
    const { user } = await this.usersSer.findOne(id);

    const newTask = this.tasksRep.create({ ...createTaskDto, user });

    return {
      ok: true,
      task: await this.tasksRep.save(newTask),
    };
  }

  async findAll(queryFilters: TasksFiltersDto) {
    const query = this.tasksRep.createQueryBuilder('t');

    const { data: tasks, ...res } = await getResponsePaginated(
      query,
      queryFilters,
    );

    return {
      ok: true,
      tasks,
      ...res,
    };
  }

  async findOne(id: string, { id: user_id }: TokenPayload) {
    const task = await this.tasksRep.findOne({
      where: { id, user: { id: user_id } },
    });

    if (!task) throw new NotFoundException('Task not found');

    return {
      ok: true,
      task,
    };
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    { id: user_id, role }: TokenPayload,
  ) {
    await this.findOne(id, { id: user_id, role });

    await this.tasksRep.update(id, updateTaskDto);

    return {
      ok: true,
      message: 'Task updated successfully',
    };
  }

  async remove(id: string, { id: user_id, role }: TokenPayload) {
    const { task } = await this.findOne(id, { id: user_id, role });

    await this.tasksRep.softRemove(task);

    return {
      ok: true,
      message: 'Task deleted successfully',
    };
  }
}
