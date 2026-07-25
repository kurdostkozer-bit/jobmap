import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'JobMap Iraq Backend API v1.0';
  }
}
