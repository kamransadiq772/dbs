import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { SERVICE } from './constants';
import { UserProfileModule } from './user-profile.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserProfileModule, {
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
