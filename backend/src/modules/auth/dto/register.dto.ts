import { IsEmail, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @MaxLength(32, { message: 'كلمة المرور يجب أن تكون 32 حرف كحد أقصى' })
  password!: string;

  @IsString()
  @MinLength(2, { message: 'الاسم الأول يجب أن يكون حرفين على الأقل' })
  @MaxLength(50, { message: 'الاسم الأول يجب أن يكون 50 حرف كحد أقصى' })
  firstName!: string;

  @IsString()
  @MinLength(2, { message: 'اسم العائلة يجب أن يكون حرفين على الأقل' })
  @MaxLength(50, { message: 'اسم العائلة يجب أن يكون 50 حرف كحد أقصى' })
  lastName!: string;

  @IsEnum(['seeker', 'employer'], { message: 'الدور يجب أن يكون seeker أو employer' })
  role!: 'seeker' | 'employer';
}
