import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../../../core/services/api_client.dart';
import '../../domain/models/user_model.dart';

class AuthResponse {
  final UserModel user;
  final String accessToken;
  final String? refreshToken;

  AuthResponse({
    required this.user,
    required this.accessToken,
    this.refreshToken,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      user: UserModel.fromJson(json['user']),
      accessToken: json['accessToken'] ?? '',
      refreshToken: json['refreshToken'],
    );
  }
}

class AuthRemoteDataSource {
  final ApiClient _apiClient;
  final FlutterSecureStorage _storage;

  AuthRemoteDataSource(
    this._apiClient,
    this._storage,
  );

  Future<AuthResponse> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String role = 'seeker',
  }) async {
    final response = await _apiClient.post(
      '/auth/register',
      data: {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        'role': role,
      },
    );

    final authResponse = AuthResponse.fromJson(response);
    await _apiClient.saveToken(authResponse.accessToken);

    return authResponse;
  }

  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    final response = await _apiClient.post(
      '/auth/login',
      data: {
        'email': email,
        'password': password,
      },
    );

    final authResponse = AuthResponse.fromJson(response);
    await _apiClient.saveToken(authResponse.accessToken);

    return authResponse;
  }

  Future<UserModel> getProfile() async {
    final response = await _apiClient.get('/auth/me');
    return UserModel.fromJson(response);
  }

  Future<AuthResponse> refreshToken(String refreshToken) async {
    final response = await _apiClient.post(
      '/auth/refresh',
      data: {'refreshToken': refreshToken},
    );

    final authResponse = AuthResponse.fromJson(response);
    await _apiClient.saveToken(authResponse.accessToken);

    return authResponse;
  }

  Future<void> logout() async {
    await _apiClient.clearToken();
  }
}
