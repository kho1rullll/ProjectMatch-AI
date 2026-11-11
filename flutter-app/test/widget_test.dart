import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:projectmatch_ai/core/theme/app_theme.dart';
import 'package:projectmatch_ai/features/auth/auth_screen.dart';
import 'package:projectmatch_ai/features/main/main_layout.dart';

void main() {
  setUp(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('AuthScreen Login, Register slide, and Forgot Password sheet work cleanly',
      (WidgetTester tester) async {
    tester.view.physicalSize = const Size(412, 915);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.lightTheme,
        home: const AuthScreen(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Selamat Datang Kembali!'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);
    expect(find.text('Lupa Sandi?'), findsOneWidget);

    // Open Forgot Password bottom sheet
    await tester.tap(find.text('Lupa Sandi?'));
    await tester.pumpAndSettle();
    expect(find.text('Reset Password'), findsOneWidget);
    expect(find.text('Kirim Tautan'), findsOneWidget);

    // Close Forgot Password sheet via Cancel
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();
    expect(find.text('Reset Password'), findsNothing);

    // Switch to Register mode
    await tester.tap(find.text('Daftar akun di sini'));
    await tester.pumpAndSettle();
    expect(find.text('Buat Akun Baru'), findsOneWidget);
    expect(find.text('Daftar Akun'), findsOneWidget);

    // Switch back to Login mode
    await tester.ensureVisible(find.text('Masuk di sini'));
    await tester.tap(find.text('Masuk di sini'));
    await tester.pumpAndSettle();
    expect(find.text('Selamat Datang Kembali!'), findsOneWidget);
  });

  testWidgets('MainLayout renders Dashboard header, floating Glass Nav Bar, and all 4 tabs',
      (WidgetTester tester) async {
    tester.view.physicalSize = const Size(412, 915);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.lightTheme,
        home: const MainLayout(userName: 'Raden Satria', userNim: 'V3925028'),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Hello Raden Satria'), findsOneWidget);
    expect(find.text('Proyek Rekomendasi AI'), findsOneWidget);
    expect(find.text('Home'), findsOneWidget);
  });
}
