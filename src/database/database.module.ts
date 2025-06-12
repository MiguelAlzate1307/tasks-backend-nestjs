import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSer: ConfigService) => ({
        type: 'postgres',
        host: configSer.get<string>('config.database.host'),
        port: configSer.get<number>('config.database.port'),
        username: configSer.get<string>('config.database.user'),
        password: configSer.get<string>('config.database.pass'),
        database: configSer.get<string>('config.database.name'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
