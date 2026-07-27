import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/auth_remote_datasource.dart';
import '../../data/repositories/auth_repository.dart';
import '../../domain/models/user_model.dart';
import '../../../../core/services/api_client.dart';
import '../../../../core/services/secure_storage_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// API Client Provider
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});

// Storage Provider
final secureStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return const FlutterSecureStorage();
});

// Secure Storage Service Provider
final secureStorageServiceProvider = Provider<SecureStorageService>((ref) {
  final storage = ref.watch(secureStorageProvider);
  return SecureStorageService(storage);
});

// Auth Token Providers (for direct access)
final accessTokenProvider = FutureProvider<String?>((ref) async {
  final service = ref.watch(secureStorageServiceProvider);
  return await service.getAccessToken();
});

final refreshTokenProvider = FutureProvider<String?>((ref) async {
  final service = ref.watch(secureStorageServiceProvider);
  return await service.getRefreshToken();
});

final isAuthenticatedProvider = FutureProvider<bool>((ref) async {
  final service = ref.watch(secureStorageServiceProvider);
  return await service.isAuthenticated();
});

// Remote DataSource
final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthRemoteDataSource(apiClient);
});

// Repository
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final remoteDataSource = ref.watch(authRemoteDataSourceProvider);
  return AuthRepository(remoteDataSource);
});

// Auth State
class AuthState {
  final UserModel? user;
  final bool isLoading;
  final String? error;
  final bool isAuthenticated;
  final String? accessToken;
  final String? refreshToken;

  AuthState({
    this.user,
    this.isLoading = false,
    this.error,
    this.isAuthenticated = false,
    this.accessToken,
    this.refreshToken,
  });

  AuthState copyWith({
    UserModel? user,
    bool? isLoading,
    String? error,
    bool? isAuthenticated,
    String? accessToken,
    String? refreshToken,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      accessToken: accessToken ?? this.accessToken,
      refreshToken: refreshToken ?? this.refreshToken,
    );
  }
}

// Auth Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;
  final SecureStorageService _storageService;

  AuthNotifier(this._repository, this._storageService) : super(AuthState());

  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String role = 'seeker',
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final result = await _repository.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
      );

      // Save tokens and user data to secure storage
      await _storageService.saveAuthData(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken ?? '',
        userId: result.user.id,
        userEmail: result.user.email,
      );

      state = state.copyWith(
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final result = await _repository.login(
        email: email,
        password: password,
      );

      // Save tokens and user data to secure storage
      await _storageService.saveAuthData(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken ?? '',
        userId: result.user.id,
        userEmail: result.user.email,
      );

      state = state.copyWith(
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> getProfile() async {
    state = state.copyWith(isLoading: true);
    try {
      final result = await _repository.getProfile();
      state = state.copyWith(
        user: result,
        isLoading: false,
        isAuthenticated: true,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> refreshToken() async {
    try {
      final currentRefreshToken = await _storageService.getRefreshToken();
      if (currentRefreshToken == null) {
        throw Exception('No refresh token available');
      }

      final result = await _repository.refreshToken(currentRefreshToken);

      // Update tokens
      await _storageService.saveAccessToken(result.accessToken);
      if (result.refreshToken != null) {
        await _storageService.saveRefreshToken(result.refreshToken!);
      }

      state = state.copyWith(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> logout() async {
    try {
      await _repository.logout();
    } finally {
      await _storageService.clearAll();
      state = AuthState();
    }
  }

  /// Initialize auth state from secure storage (on app startup)
  Future<void> initializeAuth() async {
    try {
      final isAuthenticated = await _storageService.isAuthenticated();
      if (isAuthenticated) {
        final accessToken = await _storageService.getAccessToken();
        final refreshToken = await _storageService.getRefreshToken();
        final userId = await _storageService.getUserId();
        final email = await _storageService.getUserEmail();

        state = state.copyWith(
          isAuthenticated: true,
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: UserModel(
            id: userId ?? '',
            email: email ?? '',
            firstName: '',
            lastName: '',
            role: 'seeker',
            createdAt: DateTime.now(),
          ),
        );
      }
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}

// Auth Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  final storageService = ref.watch(secureStorageServiceProvider);
  return AuthNotifier(repository, storageService);
});
