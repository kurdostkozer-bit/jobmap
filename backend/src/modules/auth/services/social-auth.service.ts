import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { GoogleLoginDto, FacebookLoginDto } from '../dto/social-login.dto';

@Injectable()
export class SocialAuthService {
  private readonly logger = new Logger('SocialAuthService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async googleLogin(data: GoogleLoginDto): Promise<any> {
    this.logger.log('🔵 Google login attempt:', data.email);

    // Find or create user
    let user = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      this.logger.log('✨ Creating new user from Google:', data.email);
      // Extract first and last name from displayName
      const nameParts = data.displayName.split(' ');
      const firstName = nameParts[0] || 'Google';
      const lastName = nameParts.slice(1).join(' ') || 'User';

      // Create random password since user is signing in via Google
      const randomPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = this.usersRepository.create();
      user.email = data.email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.passwordHash = hashedPassword;
      user.role = 'seeker';
      user.googleId = data.idToken;

      await this.usersRepository.save(user);
    }

    return this.generateTokens(user);
  }

  async facebookLogin(data: FacebookLoginDto): Promise<any> {
    this.logger.log('🔵 Facebook login attempt:', data.email);

    // Find or create user
    let user = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      this.logger.log('✨ Creating new user from Facebook:', data.email);
      // Extract first and last name from displayName
      const nameParts = data.displayName.split(' ');
      const firstName = nameParts[0] || 'Facebook';
      const lastName = nameParts.slice(1).join(' ') || 'User';

      // Create random password since user is signing in via Facebook
      const randomPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = this.usersRepository.create();
      user.email = data.email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.passwordHash = hashedPassword;
      user.role = 'seeker';
      user.avatarUrl = data.pictureUrl;
      user.facebookId = data.accessToken;

      await this.usersRepository.save(user);
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: User): any {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error('JWT secrets not configured');
    }

    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '7d',
        secret: jwtSecret,
      }
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        userId: user.id,
        email: user.email,
      },
      {
        expiresIn: '30d',
        secret: jwtRefreshSecret,
      }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }
}
