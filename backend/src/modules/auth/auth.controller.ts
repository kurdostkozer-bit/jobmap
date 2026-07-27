import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SocialAuthService } from './services/social-auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto, FacebookLoginDto } from './dto/social-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log('📝 Register attempt:', { email: registerDto.email });
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log('🔑 Login attempt:', { email: loginDto.email });
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any) {
    return { message: 'تم تسجيل الخروج بنجاح' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('social/google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    this.logger.log('🔵 Google login endpoint:', { email: googleLoginDto.email });
    return this.socialAuthService.googleLogin(googleLoginDto);
  }

  @Post('social/facebook')
  @HttpCode(HttpStatus.OK)
  async facebookLogin(@Body() facebookLoginDto: FacebookLoginDto) {
    this.logger.log('🔵 Facebook login endpoint:', { email: facebookLoginDto.email });
    return this.socialAuthService.facebookLogin(facebookLoginDto);
  }
}
