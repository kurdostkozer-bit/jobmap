import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/social_auth_provider.dart';

class SocialLoginButtons extends ConsumerWidget {
  final VoidCallback? onSuccess;
  final Function(String)? onError;

  const SocialLoginButtons({
    Key? key,
    this.onSuccess,
    this.onError,
  }) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final googleState = ref.watch(googleSignInProvider);
    final facebookState = ref.watch(facebookSignInProvider);

    return Column(
      children: [
        Text(
          'أو سجل باستخدام',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Google Sign In Button
            ElevatedButton.icon(
              onPressed: googleState.isLoading
                  ? null
                  : () {
                      ref.read(googleSignInProvider.notifier).signIn().then((_) {
                        final state = ref.read(googleSignInProvider);
                        state.whenData((data) {
                          if (data.isNotEmpty && data.containsKey('accessToken')) {
                            onSuccess?.call();
                          }
                        });
                      }).catchError((error) {
                        onError?.call(error.toString());
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('خطأ: $error')),
                        );
                      });
                    },
              icon: googleState.isLoading
                  ? SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Colors.blue.shade900),
                      ),
                    )
                  : const Icon(Icons.g_mobiledata),
              label: const Text('Google'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: const Color(0xFF4285F4),
                side: const BorderSide(color: Color(0xFF4285F4)),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
            const SizedBox(width: 12),
            // Facebook Sign In Button
            ElevatedButton.icon(
              onPressed: facebookState.isLoading
                  ? null
                  : () {
                      ref.read(facebookSignInProvider.notifier).signIn().then((_) {
                        final state = ref.read(facebookSignInProvider);
                        state.whenData((data) {
                          if (data.isNotEmpty && data.containsKey('accessToken')) {
                            onSuccess?.call();
                          }
                        });
                      }).catchError((error) {
                        onError?.call(error.toString());
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('خطأ: $error')),
                        );
                      });
                    },
              icon: facebookState.isLoading
                  ? SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Colors.blue.shade900),
                      ),
                    )
                  : const Icon(Icons.facebook),
              label: const Text('Facebook'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: const Color(0xFF1877F2),
                side: const BorderSide(color: Color(0xFF1877F2)),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
