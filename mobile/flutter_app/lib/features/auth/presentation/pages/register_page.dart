import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_providers.dart';

class RegisterPage extends ConsumerStatefulWidget {
  const RegisterPage({super.key});

  @override
  ConsumerState<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends ConsumerState<RegisterPage> {
  late final TextEditingController emailController;
  late final TextEditingController passwordController;
  late final TextEditingController firstNameController;
  late final TextEditingController lastNameController;
  String selectedRole = 'seeker';
  bool obscurePassword = true;

  @override
  void initState() {
    super.initState();
    emailController = TextEditingController();
    passwordController = TextEditingController();
    firstNameController = TextEditingController();
    lastNameController = TextEditingController();
  }

  Future<void> handleRegister() async {
    if (!_validateForm()) return;

    try {
      await ref.read(authProvider.notifier).register(
            email: emailController.text.trim(),
            password: passwordController.text,
            firstName: firstNameController.text.trim(),
            lastName: lastNameController.text.trim(),
            role: selectedRole,
          );

      final authState = ref.read(authProvider);
      if (authState.isAuthenticated && !mounted) return;

      if (authState.isAuthenticated) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('تم إنشاء الحساب بنجاح')),
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
    if (firstNameController.text.isEmpty) {
      _showError('أدخل الاسم الأول');
      return false;
    }
    if (lastNameController.text.isEmpty) {
      _showError('أدخل اسم العائلة');
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
        title: const Text('إنشاء حساب'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 32),
              Center(
                child: Text(
                  'انضم إلينا',
                  style: Theme.of(context).textTheme.headlineLarge,
                  textDirection: TextDirection.rtl,
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: Text(
                  'أنشئ حسابك الآن',
                  style: Theme.of(context).textTheme.bodyMedium,
                  textDirection: TextDirection.rtl,
                ),
              ),
              const SizedBox(height: 32),
              TextField(
                controller: firstNameController,
                textDirection: TextDirection.rtl,
                decoration: InputDecoration(
                  labelText: 'الاسم الأول',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  prefixIcon: const Icon(Icons.person),
                  enabled: !isLoading,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: lastNameController,
                textDirection: TextDirection.rtl,
                decoration: InputDecoration(
                  labelText: 'اسم العائلة',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  prefixIcon: const Icon(Icons.person),
                  enabled: !isLoading,
                ),
              ),
              const SizedBox(height: 12),
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
              const SizedBox(height: 12),
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
              const SizedBox(height: 16),
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: DropdownButton<String>(
                    value: selectedRole,
                    isExpanded: true,
                    underline: const SizedBox(),
                    items: const [
                      DropdownMenuItem(
                        value: 'seeker',
                        child: Text(
                          'طالب وظيفة',
                          textDirection: TextDirection.rtl,
                        ),
                      ),
                      DropdownMenuItem(
                        value: 'employer',
                        child: Text(
                          'صاحب عمل',
                          textDirection: TextDirection.rtl,
                        ),
                      ),
                      DropdownMenuItem(
                        value: 'recruitment_agency',
                        child: Text(
                          'شركة توظيف',
                          textDirection: TextDirection.rtl,
                        ),
                      ),
                      DropdownMenuItem(
                        value: 'admin',
                        child: Text(
                          'مسؤول النظام',
                          textDirection: TextDirection.rtl,
                        ),
                      ),
                    ],
                    onChanged: isLoading
                        ? null
                        : (value) {
                            setState(() => selectedRole = value ?? 'seeker');
                          },
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: isLoading ? null : handleRegister,
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
                        'إنشاء الحساب',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('لديك حساب بالفعل؟ '),
                  TextButton(
                    onPressed: isLoading
                        ? null
                        : () {
                            // Navigator.of(context).pushReplacementNamed('/login');
                          },
                    child: const Text('سجل الدخول'),
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
    firstNameController.dispose();
    lastNameController.dispose();
    super.dispose();
  }
}
