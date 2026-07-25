import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('البريد الإلكتروني مسجل بالفعل');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      email: data.email,
      passwordHash: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'seeker',
    });

    await this.usersRepository.save(user);

    return this.generateTokens(user);
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    return this.generateTokens(user);
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('المستخدم غير موجود');
    }

    return this.mapUserToResponse(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('المستخدم غير موجود');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('رمز التحديث غير صحيح');
    }
  }

  private generateTokens(user: User): AuthResponseDto {
    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET || 'secret',
      }
    );

    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
      },
      {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      }
    );

    return {
      user: this.mapUserToResponse(user),
      accessToken,
      refreshToken,
    };
  }

  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as 'seeker' | 'employer',
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }
}
