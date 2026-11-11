import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../theme/app_colors.dart';

enum BrandSize { sm, md, lg, xl }

class BrandTitle extends StatelessWidget {
  final bool isDark;
  final BrandSize size;
  final MainAxisSize mainAxisSize;

  const BrandTitle({
    super.key,
    this.isDark = true,
    this.size = BrandSize.md,
    this.mainAxisSize = MainAxisSize.min,
  });

  @override
  Widget build(BuildContext context) {
    double fontSize;
    double badgeFontSize;
    EdgeInsets badgePadding;
    double badgeRadius;

    switch (size) {
      case BrandSize.sm:
        fontSize = 15;
        badgeFontSize = 9;
        badgePadding = const EdgeInsets.symmetric(horizontal: 5, vertical: 2);
        badgeRadius = 5;
        break;
      case BrandSize.md:
        fontSize = 19;
        badgeFontSize = 10.5;
        badgePadding = const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5);
        badgeRadius = 6;
        break;
      case BrandSize.lg:
        fontSize = 23;
        badgeFontSize = 12;
        badgePadding = const EdgeInsets.symmetric(horizontal: 8, vertical: 3);
        badgeRadius = 7;
        break;
      case BrandSize.xl:
        fontSize = 28;
        badgeFontSize = 13.5;
        badgePadding = const EdgeInsets.symmetric(horizontal: 10, vertical: 3.5);
        badgeRadius = 8;
        break;
    }

    return Material(
      type: MaterialType.transparency,
      child: Row(
        mainAxisSize: mainAxisSize,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            'Project',
            style: GoogleFonts.plusJakartaSans(
              fontSize: fontSize,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.5,
              color: isDark ? Colors.white : AppColors.textHeadingLight,
            ),
          ),
          Text(
            'Match',
            style: GoogleFonts.plusJakartaSans(
              fontSize: fontSize,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.5,
              color: isDark ? const Color(0xFFD2BBFF) : AppColors.primary,
            ),
          ),
          const SizedBox(width: 6),
          Container(
            padding: badgePadding,
            decoration: BoxDecoration(
              color: AppColors.accentLime,
              borderRadius: BorderRadius.circular(badgeRadius),
            ),
            child: Text(
              'AI',
              style: GoogleFonts.plusJakartaSans(
                fontSize: badgeFontSize,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.8,
                color: const Color(0xFF0F172A),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class BrandLogoIcon extends StatelessWidget {
  final BrandSize size;

  const BrandLogoIcon({
    super.key,
    this.size = BrandSize.md,
  });

  @override
  Widget build(BuildContext context) {
    double dimension;
    double iconSize;
    double borderRadius;

    switch (size) {
      case BrandSize.sm:
        dimension = 30;
        iconSize = 16;
        borderRadius = 9;
        break;
      case BrandSize.md:
        dimension = 38;
        iconSize = 20;
        borderRadius = 11;
        break;
      case BrandSize.lg:
        dimension = 54;
        iconSize = 28;
        borderRadius = 16;
        break;
      case BrandSize.xl:
        dimension = 72;
        iconSize = 38;
        borderRadius = 22;
        break;
    }

    return Container(
      width: dimension,
      height: dimension,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        color: AppColors.bgDarkNavy,
        border: Border.all(
          color: AppColors.accentLimeGlow.withValues(alpha: 0.50),
          width: 1.4,
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius - 1),
        child: Image.asset(
          'assets/images/logo.png',
          width: dimension,
          height: dimension,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return Icon(
              LucideIcons.sparkles,
              color: AppColors.accentLimeGlow,
              size: iconSize,
            );
          },
        ),
      ),
    );
  }
}
