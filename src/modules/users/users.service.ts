import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeepPartial, FindOptionsSelect, Repository } from 'typeorm';
import { HashingService } from 'src/providers/hashing.service';
import { RolesEnum } from './enums/roles.enum';
import { UsersFiltersDto } from './dto/query/users-filters.dto';
import { getResponsePaginated } from 'src/global/dto/filters-paginated.dto';
import { createHash } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRep: Repository<User>,
    private readonly hashSer: HashingService,
  ) {}

  async onModuleInit() {
    const usersCount = await this.usersRep.count();

    if (!usersCount) {
      const users: DeepPartial<User>[] = [
        {
          name: 'Admin',
          username: 'Admin',
          email: 'admin@admin.com',
          password: await this.hashSer.hash('admin123'),
          role: RolesEnum.ADMIN,
        },
        {
          name: 'User',
          username: 'User',
          email: 'user@user.com',
          password: await this.hashSer.hash('user123'),
        },
      ];

      const newUsers = this.usersRep.create(users);

      await this.usersRep.save(newUsers);
    }
  }

  async create(createUserDto: CreateUserDto) {
    if (!!(await this.findOneByEmail(createUserDto.email)))
      throw new BadRequestException('Email already exists');

    if (!!(await this.findOneByUsername(createUserDto.username)))
      throw new BadRequestException('Username already exists');

    createUserDto.password = await this.hashSer.hash(createUserDto.password);

    const newUser = this.usersRep.create(createUserDto);

    const { password, refresh_token, ...user } =
      await this.usersRep.save(newUser);

    return {
      ok: true,
      user,
    };
  }

  findOneByEmail(email: string) {
    return this.usersRep.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'username',
        'email',
        'password',
        'role',
        'refresh_token',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
    });
  }

  findOneByUsername(username: string) {
    return this.usersRep.findOne({ where: { username } });
  }

  async findAll(queryFilters: UsersFiltersDto) {
    const query = this.usersRep.createQueryBuilder('u');

    const {
      data: users,
      total,
      limit,
      page,
    } = await getResponsePaginated(query, queryFilters);

    return {
      ok: true,
      users,
      total,
      limit,
      page,
    };
  }

  async findOne(
    id: string,
    relations: string[] = [],
    select?: FindOptionsSelect<User>,
  ) {
    const user = await this.usersRep.findOne({
      where: { id },
      select,
      relations,
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      ok: true,
      user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.email && !!this.findOneByEmail(updateUserDto.email))
      throw new BadRequestException('Email already exists');

    if (
      updateUserDto.username &&
      !!this.findOneByUsername(updateUserDto.username)
    )
      throw new BadRequestException('Username already exists');

    if (updateUserDto.password)
      updateUserDto.password = await this.hashSer.hash(updateUserDto.password);

    if (updateUserDto.refresh_token)
      updateUserDto.refresh_token = this.hashSer.hashToken(
        updateUserDto.refresh_token,
      );

    await this.usersRep.update(id, updateUserDto);

    return {
      ok: true,
      message: 'User updated successfully',
    };
  }

  async remove(id: string) {
    const { user } = await this.findOne(id, ['tasks']);

    await this.usersRep.softRemove(user);

    return {
      ok: true,
      message: 'User deleted successfully',
    };
  }
}
