import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userIdKey = 'user_id';
  static const String _userEmailKey = 'user_email';

  final FlutterSecureStorage _storage;

  SecureStorageService(this._storage);

  /// Save access token
  Future<void> saveAccessToken(String token) async {
    await _storage.write(
      key: _accessTokenKey,
      value: token,
    );
  }

  /// Get access token
  Future<String?> getAccessToken() async {
    return await _storage.read(key: _accessTokenKey);
  }

  /// Save refresh token
  Future<void> saveRefreshToken(String token) async {
    await _storage.write(
      key: _refreshTokenKey,
      value: token,
    );
  }

  /// Get refresh token
  Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }

  /// Save user ID
  Future<void> saveUserId(String userId) async {
    await _storage.write(
      key: _userIdKey,
      value: userId,
    );
  }

  /// Get user ID
  Future<String?> getUserId() async {
    return await _storage.read(key: _userIdKey);
  }

  /// Save user email
  Future<void> saveUserEmail(String email) async {
    await _storage.write(
      key: _userEmailKey,
      value: email,
    );
  }

  /// Get user email
  Future<String?> getUserEmail() async {
    return await _storage.read(key: _userEmailKey);
  }

  /// Check if user is authenticated
  Future<bool> isAuthenticated() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }

  /// Clear all auth data (logout)
  Future<void> clearAll() async {
    await Future.wait([
      _storage.delete(key: _accessTokenKey),
      _storage.delete(key: _refreshTokenKey),
      _storage.delete(key: _userIdKey),
      _storage.delete(key: _userEmailKey),
    ]);
  }

  /// Save all auth data at once
  Future<void> saveAuthData({
    required String accessToken,
    required String refreshToken,
    required String userId,
    required String userEmail,
  }) async {
    await Future.wait([
      saveAccessToken(accessToken),
      saveRefreshToken(refreshToken),
      saveUserId(userId),
      saveUserEmail(userEmail),
    ]);
  }
}
