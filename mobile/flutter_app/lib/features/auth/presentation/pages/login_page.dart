import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_providers.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  late final TextEditingController emailController;
  late final TextEditingController passwordController;
  bool obscurePassword = true;

  @override
  void initState() {
    super.initState();
    emailController = TextEditingController();
    passwordController = TextEditingController();
  }

  Future<void> handleLogin() async {
    if (!_validateForm()) return;

    try {
      await ref.read(authProvider.notifier).login(
            email: emailController.text.trim(),
            password: passwordController.text,
          );

      final authState = ref.read(authProvider);
      if (authState.isAuthenticated && !mounted) return;

      if (authState.isAuthenticated) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('تم تسجيل الدخول بنجاح')),
        );
        // Navigate to home
        // Navigator.of(context).pushReplacementNamed('/home');
      } else if (authState.error != null) {
        _showError(authState.error!);
      }
    } catch (e) {
      _showError('خطأ: $e');
    }
  }

  bool _validateForm() {
    if (emailController.text.isEmpty) {
      _showError('أدخل البريد الإلكتروني');
      return false;
    }
    if (passwordController.text.isEmpty) {
      _showError('أدخل كلمة المرور');
      return false;
    }
    if (passwordController.text.length < 8) {
      _showError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return false;
    }
    return true;
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final isLoading = authState.isLoading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('تسجيل الدخول'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              Center(
                child: Text(
                  'مرحبا بك',
                  style: Theme.of(context).textTheme.headlineLarge,
                  textDirection: TextDirection.rtl,
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: Text(
                  'سجل الدخول إلى حسابك',
                  style: Theme.of(context).textTheme.bodyMedium,
                  textDirection: TextDirection.rtl,
                ),
              ),
              const SizedBox(height: 48),
              TextField(
                controller: emailController,
                keyboardType: TextInputType.emailAddress,
                textDirection: TextDirection.rtl,
                decoration: InputDecoration(
                  labelText: 'البريد الإلكتروني',
                  hintText: 'example@mail.com',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  prefixIcon: const Icon(Icons.email),
                  enabled: !isLoading,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: passwordController,
                obscureText: obscurePassword,
                textDirection: TextDirection.rtl,
                decoration: InputDecoration(
                  labelText: 'كلمة المرور',
                  hintText: '••••••••',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  prefixIcon: const Icon(Icons.lock),
                  suffixIcon: IconButton(
                    icon: Icon(
                      obscurePassword ? Icons.visibility_off : Icons.visibility,
                    ),
                    onPressed: () {
                      setState(() => obscurePassword = !obscurePassword);
                    },
                  ),
                  enabled: !isLoading,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: isLoading ? null : handleLogin,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text(
                        'تسجيل الدخول',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('لا تملك حسابا؟ '),
                  TextButton(
                    onPressed: isLoading
                        ? null
                        : () {
                            // Navigator.of(context).pushNamed('/register');
                          },
                    child: const Text('سجل الآن'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
