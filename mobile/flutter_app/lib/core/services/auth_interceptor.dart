import 'package:dio/dio.dart';
import 'secure_storage_service.dart';

class AuthInterceptor extends Interceptor {
  final SecureStorageService storageService;
  final Dio dio;

  AuthInterceptor({
    required this.storageService,
    required this.dio,
  });

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await storageService.getAccessToken();

    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // Token expired, try to refresh
      final refreshToken = await storageService.getRefreshToken();

      if (refreshToken != null && refreshToken.isNotEmpty) {
        try {
          final response = await dio.post(
            '/auth/refresh',
            data: {'refreshToken': refreshToken},
          );

          if (response.statusCode == 200) {
            final newAccessToken = response.data['accessToken'];
            final newRefreshToken = response.data['refreshToken'];

            await storageService.saveAccessToken(newAccessToken);
            if (newRefreshToken != null) {
              await storageService.saveRefreshToken(newRefreshToken);
            }

            // Retry the original request
            final opts = err.requestOptions;
            opts.headers['Authorization'] = 'Bearer $newAccessToken';

            return handler.resolve(await dio.request(
              opts.path,
              options: Options(
                method: opts.method,
                headers: opts.headers,
              ),
              data: opts.data,
              queryParameters: opts.queryParameters,
            ));
          }
        } catch (e) {
          // Refresh failed, clear tokens
          await storageService.clearAll();
          return handler.next(err);
        }
      } else {
        // No refresh token, clear all
        await storageService.clearAll();
      }
    }

    return handler.next(err);
  }
}
