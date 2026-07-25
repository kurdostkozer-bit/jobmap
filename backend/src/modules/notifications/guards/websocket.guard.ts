import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

/**
 * WebSocket Guard for JWT validation on connection
 * Validates JWT token from socket handshake auth
 */
@Injectable()
export class WebSocketGuard implements CanActivate {
  private readonly logger = new Logger('WebSocketGuard');

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();

    try {
      // Extract JWT from query params or auth headers
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`⚠️ Connection rejected: No token provided from ${client.id}`);
        client.disconnect();
        return false;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      
      if (!payload.userId) {
        this.logger.warn(`⚠️ Connection rejected: Invalid token payload from ${client.id}`);
        client.disconnect();
        return false;
      }

      // Attach user info to socket for later use
      client.data.userId = payload.userId;
      client.data.email = payload.email;
      client.data.token = token;

      this.logger.log(`✅ WebSocket authenticated for user ${payload.userId}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ JWT verification failed: ${error.message}`);
      client.disconnect();
      return false;
    }
  }
}
