import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject, Injectable } from '@nestjs/common';
import type { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  getHello(): string {
    this.logger.info({
      message: 'Greetings form Nestjs backend service',
      path: '/',
      context: AppService.name,
    }); // Basic test message
    return 'Hello World!';
  }
}
