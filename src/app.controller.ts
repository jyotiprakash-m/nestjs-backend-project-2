import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import type { Logger } from 'winston';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  getHello(): string {
    // throw new InternalServerErrorException(
    //   'Intentional error for testing logging',
    // );
    return this.appService.getHello();
  }
  @Get('hello')
  getHelloBoy(): string {
    return 'CI/CD is working';
  }
  //create a get request which will return an object
  @Get('profile')
  getProfile(): object {
    // add a logger
    this.logger.info({
      message: 'Profile data creation',
      input: { name: 'JP', age: '25', title: 'Full Stack Developer' },
      path: '/profile',
      context: AppController.name,
    });
    return {
      name: 'JP',
      age: '25',
      title: 'Full Stack Developer',
    };
  }
}
