import '../../domain/models/user_model.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;

  AuthRepository(this._remoteDataSource);

  Future<AuthResponse> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String role = 'seeker',
  }) async {
    try {
      return await _remoteDataSource.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      return await _remoteDataSource.login(
        email: email,
        password: password,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<UserModel> getProfile() async {
    try {
      return await _remoteDataSource.getProfile();
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthResponse> refreshToken(String refreshToken) async {
    try {
      return await _remoteDataSource.refreshToken(refreshToken);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      await _remoteDataSource.logout();
    } catch (e) {
      rethrow;
    }
  }
}
