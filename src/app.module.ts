import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { cwd } from 'process';
import { ForkEntityManagerMiddleware } from './middleware/fork.middleware';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: join(cwd(), '.env'),
      cache: true,
      isGlobal: true
    })
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ForkEntityManagerMiddleware).forRoutes("*")
  }
}
