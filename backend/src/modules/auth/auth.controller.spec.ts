import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  const mockUser = {
    id: 'test-uuid-1',
    email: 'test@example.com',
    firstName: 'أحمد',
    lastName: 'محمد',
    role: 'seeker' as const,
    avatarUrl: undefined,
    createdAt: new Date(),
  };

  const mockAuthResponse: AuthResponseDto = {
    user: mockUser,
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockAuthResponse),
            login: jest.fn().mockResolvedValue(mockAuthResponse),
            getProfile: jest.fn().mockResolvedValue(mockUser),
            refreshToken: jest.fn().mockResolvedValue(mockAuthResponse),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'TestPassword123',
        firstName: 'علي',
        lastName: 'حسن',
        role: 'employer',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(mockUser.email);
    });

    it('should validate email format', async () => {
      const invalidRegisterDto = {
        email: 'invalid-email',
        password: 'TestPassword123',
        firstName: 'علي',
        lastName: 'حسن',
        role: 'employer',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidRegisterDto)
        .expect(400);
    });

    it('should validate password length', async () => {
      const invalidRegisterDto = {
        email: 'user@example.com',
        password: 'short',
        firstName: 'علي',
        lastName: 'حسن',
        role: 'employer',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidRegisterDto)
        .expect(400);
    });

    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);
    });

    it('should reject duplicate email', async () => {
      jest
        .spyOn(authService, 'register')
        .mockRejectedValueOnce(new Error('Email already registered'));

      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'TestPassword123',
        firstName: 'علي',
        lastName: 'حسن',
        role: 'employer',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(500);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'TestPassword123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should validate email format on login', async () => {
      const invalidLoginDto = {
        email: 'invalid-email',
        password: 'TestPassword123',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto)
        .expect(400);
    });

    it('should reject login with wrong password', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new Error('Invalid email or password'));

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(500);
    });

    it('should reject login for non-existent user', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(new Error('Invalid email or password'));

      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'TestPassword123',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(500);
    });
  });

  describe('GET /auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('lastName');
    });

    it('should reject request without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('should reject request with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return new tokens with valid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'valid-refresh-token' })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should reject with invalid refresh token', async () => {
      jest
        .spyOn(authService, 'refreshToken')
        .mockRejectedValueOnce(new Error('Invalid refresh token'));

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(500);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject logout without token', async () => {
      await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });
  });

  describe('Complete Auth Flow', () => {
    it('should complete register -> login -> get profile -> logout flow', async () => {
      // Register
      const registerDto: RegisterDto = {
        email: 'flowtest@example.com',
        password: 'TestPassword123',
        firstName: 'علي',
        lastName: 'حسن',
        role: 'seeker',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      const accessToken = registerResponse.body.accessToken;
      expect(accessToken).toBeDefined();

      // Get Profile
      const profileResponse = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(profileResponse.body.email).toBe(mockUser.email);

      // Logout
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should complete login flow with token refresh', async () => {
      // Login
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'TestPassword123',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      const refreshToken = loginResponse.body.refreshToken;
      expect(refreshToken).toBeDefined();

      // Refresh Token
      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(refreshResponse.body.accessToken).toBeDefined();
      expect(refreshResponse.body.refreshToken).toBeDefined();
    });
  });
});
