import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerService } from './shared/swagger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get<ConfigService>(ConfigService);
  app.enableCors();
  if (
    config.get('NODE_ENV') == 'production' &&
    config.get('CLOUDWATCH_LOGS') == 'true'
  ) {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }

  const documentConfig = new DocumentBuilder()
    .setTitle('DBS API Gateway')
    .setDescription(
      'DBS API Gateway is open for development and testing purposes for FE devs.',
    )
    .addBearerAuth()
    // .addServer(`${config.get('API_BASE_URI')}:${config.get('API_BASE_PORT')}`)
    .setVersion('3.0')
    .build();
  new SwaggerService('api', app, documentConfig).init();
  app.disable('x-powered-by');
  await app.listen(config.get('API_BASE_PORT'));
}
bootstrap();
