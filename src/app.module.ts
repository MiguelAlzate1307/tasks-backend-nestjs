import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import config from './config';
import { APP_GUARD } from '@nestjs/core';
import { AccTokenGuard } from './global/guards/acc-token.guard';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccTokenGuard,
    },
  ],
})
export class AppModule {}
