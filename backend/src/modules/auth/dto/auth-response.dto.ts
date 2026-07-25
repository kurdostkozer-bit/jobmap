export class UserResponseDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: 'seeker' | 'employer';
  avatarUrl?: string;
  createdAt!: Date;
}

export class AuthResponseDto {
  user!: UserResponseDto;
  accessToken!: string;
  refreshToken?: string;
}
