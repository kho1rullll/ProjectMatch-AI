import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Custom clipper that renders a clean curved boundary on the top edge
/// of a white bottom container, creating a curved dark purple header above it.
class WhiteSheetCurveClipper extends CustomClipper<Path> {
  final double curveDepth;

  WhiteSheetCurveClipper({this.curveDepth = 32.0});

  @override
  Path getClip(Size size) {
    final Path path = Path();
    path.moveTo(0, curveDepth);
    // Smooth graceful curve sweeping across the top boundary
    path.quadraticBezierTo(
      size.width * 0.5,
      -curveDepth * 0.65,
      size.width,
      curveDepth,
    );
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(covariant WhiteSheetCurveClipper oldClipper) =>
      oldClipper.curveDepth != curveDepth;
}

/// Custom clipper for a Circular Reveal / Shape Morphing transition
/// expanding upwards from the bottom center of the screen.
class BottomCircularRevealClipper extends CustomClipper<Path> {
  final double progress;

  BottomCircularRevealClipper({required this.progress});

  @override
  Path getClip(Size size) {
    if (progress >= 1.0) {
      return Path()..addRect(Rect.fromLTWH(0, 0, size.width, size.height));
    }
    if (progress <= 0.0) {
      return Path();
    }

    final Offset center = Offset(size.width / 2, size.height * 1.02);
    final double maxRadius = math.sqrt(
      math.pow(size.width / 2, 2) + math.pow(size.height * 1.05, 2),
    );
    final double radius = maxRadius * progress;

    return Path()..addOval(Rect.fromCircle(center: center, radius: radius));
  }

  @override
  bool shouldReclip(covariant BottomCircularRevealClipper oldClipper) =>
      oldClipper.progress != progress;
}

