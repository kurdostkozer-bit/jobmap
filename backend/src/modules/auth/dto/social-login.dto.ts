export class GoogleLoginDto {
  idToken: string;
  accessToken: string;
  email: string;
  displayName: string;
}

export class FacebookLoginDto {
  accessToken: string;
  email: string;
  displayName: string;
  pictureUrl?: string;
}
