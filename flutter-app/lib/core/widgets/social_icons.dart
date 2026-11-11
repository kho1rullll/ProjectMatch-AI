import 'package:flutter/material.dart';

/// Authentic 4-color Google 'G' vector logo rendered via CustomPainter.
class GoogleLogoIcon extends StatelessWidget {
  final double size;

  const GoogleLogoIcon({super.key, this.size = 20});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _GoogleLogoPainter(),
      ),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    final double strokeWidth = w * 0.20;
    final Rect rect = Rect.fromLTWH(
      strokeWidth / 2,
      strokeWidth / 2,
      w - strokeWidth,
      h - strokeWidth,
    );

    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt;

    // Red top-left / top arc
    paint.color = const Color(0xFFEA4335);
    canvas.drawArc(rect, -2.4, 1.85, false, paint);

    // Yellow left arc
    paint.color = const Color(0xFFFBBC05);
    canvas.drawArc(rect, 2.55, 1.35, false, paint);

    // Green bottom arc
    paint.color = const Color(0xFF34A853);
    canvas.drawArc(rect, 0.8, 1.78, false, paint);

    // Blue right arc + horizontal bar
    paint.color = const Color(0xFF4285F4);
    canvas.drawArc(rect, -0.05, 0.9, false, paint);

    final Paint barPaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;
    canvas.drawRect(
      Rect.fromLTWH(w * 0.50, h * 0.42, w * 0.48, strokeWidth * 0.88),
      barPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Authentic GitHub Octocat vector icon rendered via CustomPainter.
class GithubLogoIcon extends StatelessWidget {
  final double size;
  final Color color;

  const GithubLogoIcon({
    super.key,
    this.size = 20,
    this.color = const Color(0xFF0F172A),
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _GithubLogoPainter(color: color),
      ),
    );
  }
}

class _GithubLogoPainter extends CustomPainter {
  final Color color;

  _GithubLogoPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final double scaleX = size.width / 24.0;
    final double scaleY = size.height / 24.0;
    canvas.save();
    canvas.scale(scaleX, scaleY);

    final Path path = Path()
      ..moveTo(12, 1.27)
      ..cubicTo(5.92, 1.27, 1, 6.19, 1, 12.27)
      ..cubicTo(1, 17.13, 4.16, 21.25, 8.54, 22.71)
      ..cubicTo(9.09, 22.81, 9.29, 22.47, 9.29, 22.18)
      ..cubicTo(9.29, 21.92, 9.28, 21.22, 9.28, 20.3)
      ..cubicTo(6.21, 20.97, 5.56, 18.82, 5.56, 18.82)
      ..cubicTo(5.06, 17.55, 4.34, 17.21, 4.34, 17.21)
      ..cubicTo(3.34, 16.53, 4.42, 16.54, 4.42, 16.54)
      ..cubicTo(5.52, 16.62, 6.1, 17.67, 6.1, 17.67)
      ..cubicTo(7.08, 19.35, 8.67, 18.86, 9.3, 18.58)
      ..cubicTo(9.4, 17.87, 9.68, 17.39, 9.99, 17.11)
      ..cubicTo(7.54, 16.83, 4.97, 15.89, 4.97, 11.67)
      ..cubicTo(4.97, 10.47, 5.4, 9.48, 6.11, 8.71)
      ..cubicTo(6.0, 8.43, 5.62, 7.3, 6.22, 5.77)
      ..cubicTo(6.22, 5.77, 7.15, 5.47, 9.26, 6.9)
      ..cubicTo(10.14, 6.66, 11.08, 6.53, 12.01, 6.53)
      ..cubicTo(12.94, 6.53, 13.88, 6.66, 14.76, 6.9)
      ..cubicTo(16.87, 5.47, 17.8, 5.77, 17.8, 5.77)
      ..cubicTo(18.4, 7.3, 18.02, 8.43, 17.91, 8.71)
      ..cubicTo(18.62, 9.48, 19.05, 10.47, 19.05, 11.67)
      ..cubicTo(19.05, 15.9, 16.47, 16.83, 14.01, 17.1)
      ..cubicTo(14.4, 17.44, 14.75, 18.11, 14.75, 19.14)
      ..cubicTo(14.75, 20.61, 14.74, 21.8, 14.74, 22.17)
      ..cubicTo(14.74, 22.46, 14.94, 22.81, 15.5, 22.7)
      ..cubicTo(19.86, 21.24, 23.0, 17.12, 23.0, 12.27)
      ..cubicTo(23.0, 6.19, 18.08, 1.27, 12.0, 1.27)
      ..close();

    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    canvas.drawPath(path, paint);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _GithubLogoPainter oldDelegate) =>
      oldDelegate.color != color;
}

