# Social Login Setup Guide

## Overview
This document explains how to set up Google and Facebook login for JobMap Iraq application.

## Prerequisites

### Google Sign-In Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google+ API

2. **Configure OAuth Consent Screen**
   - Go to APIs & Services > OAuth consent screen
   - Choose "External" for user type
   - Fill in required information

3. **Create OAuth 2.0 Credentials**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > OAuth 2.0 Client ID
   - Choose "Android" or "iOS" application type
   - Download the credentials

4. **Get Client IDs**
   - Android: From Google Cloud Console
   - iOS: From Google Cloud Console
   - Web: Create Web application and get Client ID

### Facebook Login Setup

1. **Create Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Create a new app
   - Choose "Consumer" app type

2. **Configure Products**
   - Add "Facebook Login" product
   - Go to Settings > Basic and copy App ID and App Secret

3. **Configure Platforms**
   - Go to Settings > Basic > App Domains
   - Add your domain
   - Go to Facebook Login > Settings
   - Add Valid OAuth Redirect URIs: `https://yourdomain.com/auth/callback`

## Flutter Implementation

### Android Configuration

1. **Google Sign-In**
   - The package handles most of the setup
   - Ensure you have the correct Google Client ID in google_sign_in configuration

2. **Facebook Login**
   - Add to `android/app/build.gradle`:
   ```gradle
   dependencies {
       implementation 'com.facebook.android:facebook-android-sdk:latest.release'
   }
   ```

   - Create/Update `android/app/src/main/AndroidManifest.xml` with Facebook meta-data:
   ```xml
   <application>
       <meta-data
           android:name="com.facebook.sdk.ApplicationId"
           android:value="@string/facebook_app_id" />
   </application>
   ```

   - Add to `android/app/src/main/res/values/strings.xml`:
   ```xml
   <string name="facebook_app_id">YOUR_FACEBOOK_APP_ID</string>
   ```

### iOS Configuration

1. **Google Sign-In**
   - Update `ios/Runner/Info.plist`:
   ```xml
   <key>GIDClientID</key>
   <string>YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com</string>
   <key>URL types</key>
   <array>
       <dict>
           <key>URL Schemes</key>
           <array>
               <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
           </array>
       </dict>
   </array>
   ```

2. **Facebook Login**
   - Update `ios/Runner/Info.plist`:
   ```xml
   <key>FacebookAppID</key>
   <string>YOUR_FACEBOOK_APP_ID</string>
   <key>FacebookDisplayName</key>
   <string>JobMap Iraq</string>
   <key>LSApplicationQueriesSchemes</key>
   <array>
       <string>fbapi</string>
       <string>fbapi20130614</string>
       <string>fbconnect</string>
       <string>fbshare</string>
   </array>
   ```

## Web Implementation

1. **Update Social Auth Configuration**
   - Edit `web/social-auth.js`
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID
   - Replace `YOUR_FACEBOOK_APP_ID` with your actual Facebook App ID

2. **Add Google Sign-In SDK**
   - Add to `web/index.html` `<head>`:
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   ```

3. **Add Facebook SDK**
   - Add to `web/index.html` `<body>`:
   ```html
   <div id="fb-root"></div>
   <script async defer crossorigin="anonymous" 
       src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0&appId=YOUR_FACEBOOK_APP_ID" 
       nonce="RANDOM_NONCE">
   </script>
   ```

## Backend Implementation

### API Endpoints

**POST** `/auth/social/google`
```json
{
  "idToken": "google_id_token",
  "accessToken": "google_access_token",
  "email": "user@example.com",
  "displayName": "User Name"
}
```

**POST** `/auth/social/facebook`
```json
{
  "accessToken": "facebook_access_token",
  "email": "user@example.com",
  "displayName": "User Name",
  "pictureUrl": "https://example.com/picture.jpg"
}
```

### Response

Both endpoints return:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "First",
    "lastName": "Last",
    "role": "seeker",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

## User Entity Fields

New fields added to User entity for social login:
- `googleId`: Optional[String] - Google ID token
- `facebookId`: Optional[String] - Facebook access token
- `avatarUrl`: Optional[String] - Profile picture URL

## Environment Variables

Make sure the following are set in your `.env` file:
```
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

## Testing

### Flutter App
1. Connect your Android device or iOS simulator
2. Run `flutter run`
3. Test Google Sign-In by clicking the Google button
4. Test Facebook Login by clicking the Facebook button

### Web App
1. Open `web/index.html` in your browser
2. Update Social Auth configuration with your credentials
3. Test Google Sign-In
4. Test Facebook Login

## Security Considerations

1. **Never commit** credentials or API keys
2. **Use environment variables** for sensitive data
3. **Validate tokens** on the backend before creating accounts
4. **Implement rate limiting** on authentication endpoints
5. **Use HTTPS** in production
6. **Add CORS** configuration for allowed origins

## Troubleshooting

### Google Sign-In Issues
- Verify Google Client ID matches your app
- Check SHA-1 fingerprint in Google Cloud Console matches your build
- Ensure internet permission in Android Manifest

### Facebook Login Issues
- Verify Facebook App ID is correct
- Check app is in development or live mode
- Ensure hash key is registered in Facebook app settings

### Backend Integration Issues
- Verify API endpoints are accessible
- Check JWT secrets are set correctly
- Validate user creation is working properly

## References

- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Flutter Google Sign-In Package](https://pub.dev/packages/google_sign_in)
- [Flutter Facebook Auth Package](https://pub.dev/packages/flutter_facebook_auth)
