import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/brand_logo.dart';
import '../../core/widgets/curved_header_clipper.dart';
import '../auth/login_page.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Timer? _navigationTimer;

  @override
  void initState() {
    super.initState();
    _navigationTimer = Timer(const Duration(milliseconds: 2600), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            transitionDuration: const Duration(milliseconds: 950),
            pageBuilder: (context, animation, secondaryAnimation) => const LoginPage(),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              final curved = CurvedAnimation(
                parent: animation,
                curve: Curves.easeInOutCubic,
              );

              // Circular reveal / shape morph expanding from bottom to top
              // while keeping the dark purple base underneath so Hero flight stays seamless
              return Stack(
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      gradient: AppColors.splashGradient,
                    ),
                  ),
                  ClipPath(
                    clipper: BottomCircularRevealClipper(progress: curved.value),
                    child: child,
                  ),
                ],
              );
            },
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _navigationTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        alignment: Alignment.center,
        children: [
          // Clean Dark Purple Background with Smooth Bright Purple & Lemon Green Gradient
          Container(
            width: double.infinity,
            height: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFF1A0736), // Ungu gelap utama
                  Color(0xFF2E1065), // Ungu gelap
                  Color(0xFF6D28D9), // Gradasi ungu terang
                  Color(0xFF4D7C0F), // Variasi halus hijau lemon
                ],
                stops: [0.0, 0.45, 0.80, 1.0],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),

          // Central Animated Brand Content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo Icon with Crisp Rotating Ring (No Haze/Glow)
                Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppColors.accentLimeGlow.withValues(alpha: 0.45),
                          width: 1.5,
                        ),
                      ),
                    )
                        .animate(onPlay: (controller) => controller.repeat())
                        .rotate(duration: 6000.ms),

                    const Hero(
                      tag: 'brand_logo_hero',
                      child: BrandLogoIcon(size: BrandSize.xl),
                    )
                        .animate()
                        .fadeIn(duration: 650.ms)
                        .scale(
                          begin: const Offset(0.7, 0.7),
                          end: const Offset(1.0, 1.0),
                          duration: 750.ms,
                          curve: Curves.easeOutBack,
                        ),
                  ],
                ),

                const SizedBox(height: 26),

                // Brand Title "ProjectMatch AI" with Hero Animation to Top-Left of Login Screen
                const Hero(
                  tag: 'brand_title_hero',
                  child: BrandTitle(
                    isDark: true,
                    size: BrandSize.xl,
                    mainAxisSize: MainAxisSize.min,
                  ),
                )
                    .animate()
                    .fadeIn(delay: 300.ms, duration: 550.ms)
                    .slideY(begin: 0.25, end: 0, curve: Curves.easeOut),

                const SizedBox(height: 14),

                // Tagline Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primaryDarkDeep.withValues(alpha: 0.65),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                      color: AppColors.accentLimeGlow.withValues(alpha: 0.45),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        LucideIcons.sparkles,
                        size: 13,
                        color: AppColors.accentLimeGlow,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'AI Career Automation Platform',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.accentLimeGlow,
                          letterSpacing: 0.2,
                        ),
                      ),
                    ],
                  ),
                )
                    .animate()
                    .fadeIn(delay: 550.ms, duration: 550.ms)
                    .slideY(begin: 0.25, end: 0, curve: Curves.easeOut),
              ],
            ),
          ),

          // Bottom Loading Indicator & Subtitle
          Positioned(
            bottom: 48,
            child: Column(
              children: [
                const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.4,
                    valueColor: AlwaysStoppedAnimation<Color>(AppColors.accentLimeGlow),
                  ),
                ).animate().fadeIn(delay: 750.ms, duration: 450.ms),
                const SizedBox(height: 12),
                Text(
                  'Powered by Neural Matching Engine',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: Colors.white70,
                  ),
                ).animate().fadeIn(delay: 900.ms, duration: 450.ms),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
