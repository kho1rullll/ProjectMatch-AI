import 'package:flutter/material.dart';

/// Palet warna resmi ProjectMatch AI Mobile.
/// Menggunakan Ungu Gelap sebagai warna utama dengan aksen Ungu Terang & Hijau Lemon,
/// serta latar belakang putih bersih untuk area konten utama.
class AppColors {
  AppColors._();

  // Primary: Dark Purple & Electric Purple
  static const Color primaryDarkDeep = Color(0xFF1E0B38);
  static const Color primaryDark = Color(0xFF2E1065);
  static const Color primarySolid = Color(0xFF3B0764);
  static const Color primaryHeader = Color(0xFF4C1D95);
  static const Color primary = Color(0xFF7C3AED);
  static const Color primaryBright = Color(0xFF9333EA);
  static const Color primaryLight = Color(0xFFEDE9FE);
  static const Color primaryFixedDim = Color(0xFFD2BBFF);

  // Accent: Lemon Green (Fluorescent Lime)
  static const Color accentLime = Color(0xFF84CC16);
  static const Color accentLimeGlow = Color(0xFFA3E635);
  static const Color accentLimeLight = Color(0xFFECFCCB);
  static const Color accentLimeDark = Color(0xFF457000);

  // Backgrounds: Light Canvas & Dark Sections
  static const Color surfaceWhite = Color(0xFFFFFFFF);
  static const Color canvasLight = Color(0xFFFAFAFC);
  static const Color bgLightSubtle = Color(0xFFF1F5F9);
  static const Color bgDarkNavy = Color(0xFF0B0F19);

  // Text Colors
  static const Color textHeadingLight = Color(0xFF0F172A);
  static const Color textHeadingDark = Color(0xFFF8FAFC);
  static const Color textBodyLight = Color(0xFF475569);
  static const Color textBodyDark = Color(0xFFCBD5E1);
  static const Color textMuted = Color(0xFF64748B);

  // Borders
  static const Color borderLight = Color(0xFFE2E8F0);
  static const Color borderInput = Color(0xFFCBD5E1);
  static const Color borderGlassDark = Color(0x26FFFFFF);

  // Status
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);

  // Gradients
  static const LinearGradient splashGradient = LinearGradient(
    colors: [
      Color(0xFF1A0736), // Deep dark purple
      Color(0xFF2E1065), // Dark purple
      Color(0xFF4C1D95), // Purple
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient headerPurpleGradient = LinearGradient(
    colors: [
      Color(0xFF2E1065),
      Color(0xFF4C1D95),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient purpleButtonGradient = LinearGradient(
    colors: [
      Color(0xFF3B0764),
      Color(0xFF5B21B6),
    ],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}
