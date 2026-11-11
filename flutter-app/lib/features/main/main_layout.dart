import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import 'home_page.dart';
import 'messages_page.dart';
import 'profile_page.dart';
import 'projects_page.dart';

class MainLayout extends StatefulWidget {
  final int initialIndex;
  final String userName;
  final String userNim;

  const MainLayout({
    super.key,
    this.initialIndex = 0,
    this.userName = 'Raden Satria',
    this.userNim = 'V3925028',
  });

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  void _onTabSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      HomePage(
        onExploreProjects: () => _onTabSelected(1),
        userName: widget.userName,
        userNim: widget.userNim,
      ),
      const ProjectsPage(),
      const MessagesPage(),
      ProfilePage(
        userName: widget.userName,
        userNim: widget.userNim,
      ),
    ];

    return Scaffold(
      backgroundColor: AppColors.canvasLight,
      body: Stack(
        children: [
          // Active Tab Content (Light Canvas + Dark Purple Header)
          IndexedStack(
            index: _currentIndex,
            children: pages,
          ),

          // Floating Liquid Glass Bottom Navigation Bar (ONLY element keeping Liquid Glass)
          Positioned(
            left: 20,
            right: 20,
            bottom: 20,
            child: _buildFloatingLiquidGlassNavBar()
                .animate()
                .fadeIn(delay: 320.ms, duration: 450.ms)
                .slideY(begin: 0.4, end: 0, curve: Curves.easeOutCubic),
          ),
        ],
      ),
    );
  }

  Widget _buildFloatingLiquidGlassNavBar() {
    return Container(
      height: 68,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryDarkDeep.withValues(alpha: 0.24),
            blurRadius: 26,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(999),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 22, sigmaY: 22),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF1E0B38).withValues(alpha: 0.84),
                  const Color(0xFF2E1065).withValues(alpha: 0.78),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.24),
                width: 1.2,
              ),
            ),
            child: Stack(
              children: [
                // Specular glass rim shine on top edge
                Positioned(
                  top: 0,
                  left: 24,
                  right: 24,
                  height: 1,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          Colors.white.withValues(alpha: 0.45),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildNavItem(index: 0, label: 'Home', icon: LucideIcons.home),
                      _buildNavItem(index: 1, label: 'Proyek', icon: LucideIcons.search),
                      _buildNavItem(
                        index: 2,
                        label: 'Pesan',
                        icon: LucideIcons.messageSquare,
                        badgeCount: 2,
                      ),
                      _buildNavItem(index: 3, label: 'Akun', icon: LucideIcons.user),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required String label,
    required IconData icon,
    int? badgeCount,
  }) {
    final bool isSelected = _currentIndex == index;

    return GestureDetector(
      onTap: () => _onTabSelected(index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOutCubic,
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? 16 : 10,
          vertical: 8,
        ),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.accentLime.withValues(alpha: 0.20) : Colors.transparent,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(
            color: isSelected ? AppColors.accentLimeGlow.withValues(alpha: 0.55) : Colors.transparent,
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: isSelected ? AppColors.accentLimeGlow : Colors.white70,
                ),
                if (badgeCount != null && badgeCount > 0)
                  Positioned(
                    top: -4,
                    right: -6,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: AppColors.accentLime,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '$badgeCount',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 8.5,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF0F172A),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.2,
                  color: AppColors.accentLimeGlow,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
