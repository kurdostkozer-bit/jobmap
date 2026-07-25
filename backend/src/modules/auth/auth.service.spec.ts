import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUser = {
    id: 'test-uuid-1',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    firstName: 'أحمد',
    lastName: 'محمد',
    role: 'seeker',
    avatarUrl: undefined,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegisterDto: RegisterDto = {
    email: 'newuser@example.com',
    password: 'TestPassword123',
    firstName: 'علي',
    lastName: 'حسن',
    role: 'employer',
  };

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'TestPassword123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashed-test-password';
      
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser as any);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await service.register(mockRegisterDto);

      expect(result.user.email).toBe(mockUser.email);
      expect(result.accessToken).toBe('test-token');
      expect(usersRepository.save).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash password correctly', async () => {
      const hashedPassword = 'hashed-test-password';
      
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser as any);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      await service.register(mockRegisterDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
    });

    it('should return user with all required fields', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
      jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser as any);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await service.register(mockRegisterDto);

      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('firstName');
      expect(result.user).toHaveProperty('lastName');
      expect(result.user).toHaveProperty('role');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await service.login(
        mockLoginDto.email,
        mockLoginDto.password,
      );

      expect(result.user.email).toBe(mockUser.email);
      expect(result.accessToken).toBe('test-token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.login(mockLoginDto.email, mockLoginDto.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login(mockLoginDto.email, mockLoginDto.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should compare password correctly', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      await service.login(mockLoginDto.email, mockLoginDto.password);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockUser.passwordHash,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile by userId', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getProfile('non-existent-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should generate new tokens with valid refresh token', async () => {
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ userId: mockUser.id, email: mockUser.email });
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(newAccessToken);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(newRefreshToken);

      const result = await service.refreshToken('old-refresh-token');

      expect(result.accessToken).toBe(newAccessToken);
      expect(result.refreshToken).toBe(newRefreshToken);
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.refreshToken('invalid-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ userId: 'non-existent', email: 'test@example.com' });
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.refreshToken('valid-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Token generation', () => {
    it('should generate JWT with correct payload', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
      jest.spyOn(usersRepository, 'create').mockReturnValue(mockUser as any);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      await service.register(mockRegisterDto);

      expect(jwtService.sign).toHaveBeenCalled();
      const signCalls = (jwtService.sign as jest.Mock).mock.calls;
      
      // Check first call (access token)
      expect(signCalls[0][0]).toHaveProperty('userId', mockUser.id);
      expect(signCalls[0][0]).toHaveProperty('email', mockUser.email);
      expect(signCalls[0][0]).toHaveProperty('role', mockUser.role);
    });
  });
});
