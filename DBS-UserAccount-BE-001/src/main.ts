import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UserAccountModule } from './user-account.module';
import { SERVICE } from './constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserAccountModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URI],
      queue: process.env[`RMQ_${SERVICE}_QUEUE`],
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}
bootstrap();
