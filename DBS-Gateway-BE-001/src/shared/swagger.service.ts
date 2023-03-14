import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export class SwaggerService {
  static _document: OpenAPIObject;
  constructor(
    private route: string,
    private app: INestApplication,
    private config: Omit<OpenAPIObject, 'paths'>,
  ) {
    SwaggerService._document = SwaggerModule.createDocument(
      this.app,
      this.config,
      {
        operationIdFactory: (controllerKey, methodKey) => {
          return `${controllerKey.replace('Controller', '')}.${
            methodKey.charAt(0).toUpperCase() + methodKey.slice(1)
          }`;
        },
      },
    );
  }

  public init() {
    SwaggerModule.setup(this.route, this.app, SwaggerService._document);
  }
}
