import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/curved_header_clipper.dart';

class MessagesPage extends StatelessWidget {
  const MessagesPage({super.key});

  final List<Map<String, dynamic>> _threads = const [
    {
      'name': 'Dr. Hendra Gunawan',
      'role': 'VP of AI Research • BioInformatika',
      'avatar': 'HG',
      'message': 'Halo Satria, repositori PyTorch Anda sangat impresif. Kapan ada waktu untuk technical sync?',
      'time': '10:45',
      'unread': 2,
      'isOnline': true,
    },
    {
      'name': 'PT Industri Cerdas Nusantara',
      'role': 'Talent Acquisition Team',
      'avatar': 'IC',
      'message': 'Berkas pengajuan proyek Autonomous Vision AI Anda telah lolos kurasi tahap 1.',
      'time': 'Kemarin',
      'unread': 0,
      'isOnline': false,
    },
    {
      'name': 'Lab Inovasi Kampus UNS',
      'role': 'Koordinator Proyek IoT',
      'avatar': 'UN',
      'message': 'Sensor telemetry di gedung lab sudah disinkronkan ke gateway MQTT baru.',
      'time': 'Senin',
      'unread': 0,
      'isOnline': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;

    return Container(
      color: AppColors.canvasLight,
      child: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(
            child: Container(
              padding: EdgeInsets.fromLTRB(20, topPadding + 16, 20, 20),
              decoration: const BoxDecoration(
                gradient: AppColors.headerPurpleGradient,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Pesan & Diskusi Proyek',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Komunikasi langsung dengan mentor kampus & mitra industri',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      color: const Color(0xFFE2D9F3),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Container(
              color: AppColors.primaryHeader,
              child: ClipPath(
                clipper: WhiteSheetCurveClipper(curveDepth: 20),
                child: Container(
                  color: AppColors.canvasLight,
                  padding: const EdgeInsets.fromLTRB(20, 28, 20, 110),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: AppColors.borderLight),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 14,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: List.generate(_threads.length, (idx) {
                        final item = _threads[idx];
                        final int unread = item['unread'] as int;
                        return Column(
                          children: [
                            InkWell(
                              onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Membuka ruang percakapan dengan ${item['name']}...',
                                      style: GoogleFonts.plusJakartaSans(fontSize: 12),
                                    ),
                                    backgroundColor: AppColors.primarySolid,
                                  ),
                                );
                              },
                              borderRadius: BorderRadius.circular(22),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Stack(
                                      children: [
                                        Container(
                                          width: 46,
                                          height: 46,
                                          decoration: const BoxDecoration(
                                            shape: BoxShape.circle,
                                            gradient: AppColors.headerPurpleGradient,
                                          ),
                                          alignment: Alignment.center,
                                          child: Text(
                                            item['avatar'] as String,
                                            style: GoogleFonts.plusJakartaSans(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w800,
                                              color: Colors.white,
                                            ),
                                          ),
                                        ),
                                        if (item['isOnline'] as bool)
                                          Positioned(
                                            bottom: 0,
                                            right: 0,
                                            child: Container(
                                              width: 12,
                                              height: 12,
                                              decoration: BoxDecoration(
                                                color: AppColors.accentLime,
                                                shape: BoxShape.circle,
                                                border: Border.all(color: Colors.white, width: 2),
                                              ),
                                            ),
                                          ),
                                      ],
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Flexible(
                                                child: Text(
                                                  item['name'] as String,
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: GoogleFonts.plusJakartaSans(
                                                    fontSize: 13.5,
                                                    fontWeight: FontWeight.w700,
                                                    color: AppColors.textHeadingLight,
                                                  ),
                                                ),
                                              ),
                                              Text(
                                                item['time'] as String,
                                                style: GoogleFonts.plusJakartaSans(
                                                  fontSize: 10,
                                                  color: AppColors.textMuted,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            item['role'] as String,
                                            style: GoogleFonts.plusJakartaSans(
                                              fontSize: 10.5,
                                              fontWeight: FontWeight.w600,
                                              color: AppColors.primaryHeader,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            item['message'] as String,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                            style: GoogleFonts.plusJakartaSans(
                                              fontSize: 11.5,
                                              color: unread > 0
                                                  ? AppColors.textHeadingLight
                                                  : AppColors.textBodyLight,
                                              fontWeight:
                                                  unread > 0 ? FontWeight.w600 : FontWeight.w400,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (unread > 0) ...[
                                      const SizedBox(width: 8),
                                      Container(
                                        padding: const EdgeInsets.all(6),
                                        decoration: const BoxDecoration(
                                          color: AppColors.accentLime,
                                          shape: BoxShape.circle,
                                        ),
                                        child: Text(
                                          '$unread',
                                          style: GoogleFonts.plusJakartaSans(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w900,
                                            color: const Color(0xFF0F172A),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ),
                            if (idx < _threads.length - 1)
                              const Divider(height: 1, color: AppColors.borderLight),
                          ],
                        );
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
