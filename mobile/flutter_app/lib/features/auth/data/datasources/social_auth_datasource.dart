import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';
import 'package:dio/dio.dart';

class SocialAuthDatasource {
  final Dio dio;
  final String apiBaseUrl;

  late final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: '215370690483-ucqa59t97ggffu4l0ahr0ingrp6cp7io.apps.googleusercontent.com',
    scopes: ['email', 'profile'],
  );

  SocialAuthDatasource({
    required this.dio,
    required this.apiBaseUrl,
  });

  /// Sign in with Google
  Future<Map<String, dynamic>> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

      if (googleUser == null) {
        throw Exception('تم إلغاء تسجيل الدخول');
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      // Send token to backend for verification and account creation
      final response = await dio.post(
        '$apiBaseUrl/auth/social/google',
        data: {
          'idToken': googleAuth.idToken,
          'accessToken': googleAuth.accessToken,
          'email': googleUser.email,
          'displayName': googleUser.displayName,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.data;
      } else {
        throw Exception('فشل المصادقة عبر Google');
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Sign in with Facebook
  Future<Map<String, dynamic>> signInWithFacebook() async {
    try {
      final LoginResult result = await FacebookAuth.instance.login(
        permissions: ['public_profile', 'email'],
      );

      if (result.status == LoginStatus.success) {
        final AccessToken accessToken = result.accessToken!;

        // Get user data from Facebook
        final userData =
            await FacebookAuth.instance.getUserData(fields: 'email,name,picture');

        // Send token to backend for verification and account creation
        final response = await dio.post(
          '$apiBaseUrl/auth/social/facebook',
          data: {
            'accessToken': accessToken.token,
            'email': userData['email'],
            'displayName': userData['name'],
            'pictureUrl': userData['picture']?['data']?['url'],
          },
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          return response.data;
        } else {
          throw Exception('فشل المصادقة عبر Facebook');
        }
      } else if (result.status == LoginStatus.cancelled) {
        throw Exception('تم إلغاء تسجيل الدخول');
      } else {
        throw Exception(result.message ?? 'فشل تسجيل الدخول عبر Facebook');
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Sign out from Google
  Future<void> signOutGoogle() async {
    await _googleSignIn.signOut();
  }

  /// Sign out from Facebook
  Future<void> signOutFacebook() async {
    await FacebookAuth.instance.logOut();
  }

  /// Check if user is signed in
  bool isGoogleSignedIn() {
    return _googleSignIn.currentUser != null;
  }
}
