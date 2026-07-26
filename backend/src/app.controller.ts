import { Controller, Get, Head } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Head()
  @Get()
  root() {
    return { status: 'ok', message: 'JobMap Backend is running' };
  }

  @Get('health')
  health() {
    return { status: 'ok', message: 'JobMap Backend is running' };
  }
}
