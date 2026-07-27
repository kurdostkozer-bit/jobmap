import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../data/datasources/social_auth_datasource.dart';

final dioProvider = Provider((ref) {
  return Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
  ));
});

final socialAuthDatasourceProvider = Provider((ref) {
  final dio = ref.watch(dioProvider);
  return SocialAuthDatasource(
    dio: dio,
    apiBaseUrl: 'http://localhost:3000/api', // Update for production
  );
});

final googleSignInProvider =
    StateNotifierProvider<GoogleSignInNotifier, AsyncValue<Map<String, dynamic>>>(
  (ref) {
    final datasource = ref.watch(socialAuthDatasourceProvider);
    return GoogleSignInNotifier(datasource);
  },
);

final facebookSignInProvider =
    StateNotifierProvider<FacebookSignInNotifier, AsyncValue<Map<String, dynamic>>>(
  (ref) {
    final datasource = ref.watch(socialAuthDatasourceProvider);
    return FacebookSignInNotifier(datasource);
  },
);

class GoogleSignInNotifier
    extends StateNotifier<AsyncValue<Map<String, dynamic>>> {
  final SocialAuthDatasource _datasource;

  GoogleSignInNotifier(this._datasource)
      : super(const AsyncValue.data({}));

  Future<void> signIn() async {
    state = const AsyncValue.loading();
    try {
      final result = await _datasource.signInWithGoogle();
      state = AsyncValue.data(result);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> signOut() async {
    try {
      await _datasource.signOutGoogle();
      state = const AsyncValue.data({});
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

class FacebookSignInNotifier
    extends StateNotifier<AsyncValue<Map<String, dynamic>>> {
  final SocialAuthDatasource _datasource;

  FacebookSignInNotifier(this._datasource)
      : super(const AsyncValue.data({}));

  Future<void> signIn() async {
    state = const AsyncValue.loading();
    try {
      final result = await _datasource.signInWithFacebook();
      state = AsyncValue.data(result);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> signOut() async {
    try {
      await _datasource.signOutFacebook();
      state = const AsyncValue.data({});
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
