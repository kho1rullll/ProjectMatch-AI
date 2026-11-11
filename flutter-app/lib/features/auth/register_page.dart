import 'package:flutter/material.dart';
import 'auth_screen.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const AuthScreen(initialIsRegister: true);
  }
}
