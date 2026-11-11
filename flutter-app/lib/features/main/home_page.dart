import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/curved_header_clipper.dart';

class HomePage extends StatefulWidget {
  final VoidCallback? onExploreProjects;
  final String userName;
  final String userNim;

  const HomePage({
    super.key,
    this.onExploreProjects,
    this.userName = 'Raden Satria',
    this.userNim = 'V3925028',
  });

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedCategoryIndex = 1; // Default to ML & AI
  double _currentMatchScore = 98.4;
  bool _isRecalculating = false;

  final List<Map<String, dynamic>> _categories = [
    {'name': 'Web & Mobile', 'icon': '💻', 'baseScore': 94.2},
    {'name': 'ML & AI', 'icon': '🧠', 'baseScore': 98.4},
    {'name': 'IoT Devices', 'icon': '📡', 'baseScore': 91.8},
    {'name': 'UI/UX Design', 'icon': '🎨', 'baseScore': 95.0},
  ];

  final List<Map<String, dynamic>> _recommendedProjects = [
    {
      'id': 'p1',
      'title': 'Autonomous Vision AI Quality Inspection',
      'company': 'PT Industri Cerdas Nusantara',
      'location': 'Jakarta (Remote)',
      'match': 98,
      'category': 'Machine Learning',
      'stipend': 'Rp 4.500.000 / bln',
      'tags': ['PyTorch', 'OpenCV', 'FastAPI'],
    },
    {
      'id': 'p2',
      'title': 'High-Throughput Payment Ledger Microservice',
      'company': 'Bank Digital Mandiri',
      'location': 'Bandung (Hybrid)',
      'match': 95,
      'category': 'Backend Engineering',
      'stipend': 'Rp 5.000.000 / bln',
      'tags': ['Golang', 'Redis', 'PostgreSQL'],
    },
    {
      'id': 'p3',
      'title': 'Clinical NER Diagnostic Assistant',
      'company': 'BioInformatika Nusantara',
      'location': 'Jakarta (Remote)',
      'match': 96,
      'category': 'Healthcare AI',
      'stipend': 'Rp 4.800.000 / bln',
      'tags': ['Transformers', 'HuggingFace', 'Python'],
    },
    {
      'id': 'p4',
      'title': 'Smart Campus Telemetry IoT Dashboard',
      'company': 'Lab Inovasi UNS',
      'location': 'Surakarta (Onsite)',
      'match': 92,
      'category': 'Fullstack IoT',
      'stipend': 'Rp 3.800.000 / bln',
      'tags': ['Next.js', 'MQTT', 'TypeScript'],
    },
  ];

  String _getInitials(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return 'RS';
    if (parts.length == 1) return parts[0].substring(0, parts[0].length >= 2 ? 2 : 1).toUpperCase();
    return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
  }

  void _onSelectCategory(int index) {
    setState(() {
      _selectedCategoryIndex = index;
      _isRecalculating = true;
    });

    Future.delayed(const Duration(milliseconds: 350), () {
      if (mounted) {
        setState(() {
          _currentMatchScore = (_categories[index]['baseScore'] as double);
          _isRecalculating = false;
        });
      }
    });
  }

  void _showNotificationSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Notifikasi Aktivitas (3)',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textHeadingLight,
                  ),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.x, color: AppColors.textMuted, size: 18),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 14),
            _buildNotificationItem(
              icon: LucideIcons.checkCircle2,
              iconColor: AppColors.accentLimeDark,
              bgColor: AppColors.accentLimeLight,
              title: 'Repositori GitHub Disinkronisasi',
              desc: '18 repositori publik berhasil diindeks ke pgvector embedding.',
              time: '10 menit yang lalu',
            ),
            const SizedBox(height: 10),
            _buildNotificationItem(
              icon: LucideIcons.sparkles,
              iconColor: AppColors.primary,
              bgColor: AppColors.primaryLight,
              title: 'Rekomendasi Proyek Baru Cocok',
              desc: 'Autonomous Vision AI memiliki tingkat kecocokan 98%.',
              time: '2 jam yang lalu',
            ),
            const SizedBox(height: 10),
            _buildNotificationItem(
              icon: LucideIcons.briefcase,
              iconColor: const Color(0xFF0284C7),
              bgColor: const Color(0xFFE0F2FE),
              title: 'Undangan Interview Mitra',
              desc: 'PT Industri Cerdas Nusantara mengundang untuk diskusi proyek.',
              time: '1 hari yang lalu',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationItem({
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    required String title,
    required String desc,
    required String time,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.canvasLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: bgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 16),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textHeadingLight,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  desc,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11.5,
                    color: AppColors.textBodyLight,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;
    final screenHeight = MediaQuery.of(context).size.height;
    // Header area (~15-20% visual section at top plus safe area for comfortable fit)
    final double headerTotalHeight = topPadding + (screenHeight * 0.155).clamp(132.0, 156.0);

    return Container(
      color: AppColors.canvasLight,
      child: Stack(
        children: [
          // 1. Dark Purple Header Backdrop (Top ~15-20% Section)
          Container(
            height: headerTotalHeight + 28,
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: AppColors.headerPurpleGradient,
            ),
          ),

          // 2. Scrollable Content starting seamlessly with Dark Purple Header -> White Light Section
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Header Content inside Dark Purple Area
              SliverToBoxAdapter(
                child: Container(
                  padding: EdgeInsets.fromLTRB(20, topPadding + 14, 20, 22),
                  decoration: const BoxDecoration(
                    gradient: AppColors.headerPurpleGradient,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Row 1: Profile Avatar + Hello Greeting (Name, NIM, Semester) + Notification Icon
                      Row(
                        children: [
                          // Profile Photo / Initials Avatar with Lemon Green border
                          Container(
                            width: 46,
                            height: 46,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.primaryDarkDeep,
                              border: Border.all(
                                color: AppColors.accentLimeGlow,
                                width: 2,
                              ),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              _getInitials(widget.userName),
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),

                          // Greeting, NIM & Semester
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Hello ${widget.userName}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 17,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: -0.3,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    Container(
                                      width: 6,
                                      height: 6,
                                      decoration: const BoxDecoration(
                                        color: AppColors.accentLimeGlow,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Flexible(
                                      child: Text(
                                        'NIM: ${widget.userNim} • Semester 6',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: GoogleFonts.plusJakartaSans(
                                          fontSize: 11.5,
                                          fontWeight: FontWeight.w500,
                                          color: const Color(0xFFE2D9F3),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          // Notification Icon Button
                          Material(
                            color: Colors.white.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(14),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(14),
                              onTap: _showNotificationSheet,
                              child: SizedBox(
                                width: 42,
                                height: 42,
                                child: Stack(
                                  alignment: Alignment.center,
                                  children: [
                                    const Icon(
                                      LucideIcons.bell,
                                      size: 19,
                                      color: Colors.white,
                                    ),
                                    Positioned(
                                      top: 9,
                                      right: 9,
                                      child: Container(
                                        width: 8,
                                        height: 8,
                                        decoration: const BoxDecoration(
                                          color: AppColors.accentLimeGlow,
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      )
                          .animate()
                          .fadeIn(delay: 80.ms, duration: 400.ms)
                          .slideY(begin: 0.18, end: 0, curve: Curves.easeOutCubic),

                      const SizedBox(height: 16),

                      // Row 2: Horizontal Elements Below Profile & Notification
                      Row(
                        children: [
                          Expanded(
                            child: _buildHeaderStatChip(
                              icon: LucideIcons.gitBranch,
                              value: '18 Repos',
                              label: 'GitHub Aktif',
                              accent: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildHeaderStatChip(
                              icon: LucideIcons.sparkles,
                              value: '98.4%',
                              label: 'Match Score',
                              accent: AppColors.accentLimeGlow,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildHeaderStatChip(
                              icon: LucideIcons.briefcase,
                              value: '24 Mitra',
                              label: 'Lowongan',
                              accent: const Color(0xFFD2BBFF),
                            ),
                          ),
                        ],
                      )
                          .animate()
                          .fadeIn(delay: 160.ms, duration: 420.ms)
                          .slideY(begin: 0.18, end: 0, curve: Curves.easeOutCubic),
                    ],
                  ),
                ),
              ),

              // 3. Curved Light Canvas Section Below Header
              SliverToBoxAdapter(
                child: Container(
                  color: AppColors.primaryHeader,
                  child: ClipPath(
                    clipper: WhiteSheetCurveClipper(curveDepth: 22),
                    child: Container(
                      color: AppColors.canvasLight,
                      padding: const EdgeInsets.fromLTRB(20, 34, 20, 110),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // LIVE AI MATCH CARD (Clean White Elevated Card - NO Liquid Glass)
                          _buildLiveAiMatchCard()
                              .animate()
                              .fadeIn(delay: 240.ms, duration: 450.ms)
                              .slideY(begin: 0.14, end: 0, curve: Curves.easeOutCubic),

                          const SizedBox(height: 26),

                          // Section: Proyek Rekomendasi AI
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Proyek Rekomendasi AI',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 17,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: -0.4,
                                        color: AppColors.textHeadingLight,
                                      ),
                                    ),
                                    Text(
                                      'Sesuai keahlian repositori Anda',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 11.5,
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              TextButton.icon(
                                onPressed: widget.onExploreProjects,
                                iconAlignment: IconAlignment.end,
                                icon: const Icon(
                                  LucideIcons.arrowRight,
                                  size: 14,
                                  color: AppColors.primaryHeader,
                                ),
                                label: Text(
                                  'Lihat Semua',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.primaryHeader,
                                  ),
                                ),
                              ),
                            ],
                          )
                              .animate()
                              .fadeIn(delay: 340.ms, duration: 420.ms)
                              .slideY(begin: 0.14, end: 0, curve: Curves.easeOutCubic),

                          const SizedBox(height: 12),

                          // Horizontal Scroll Carousel (Solid Clean Cards)
                          SizedBox(
                            height: 214,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              clipBehavior: Clip.none,
                              itemCount: _recommendedProjects.length,
                              separatorBuilder: (context, index) => const SizedBox(width: 14),
                              itemBuilder: (context, index) {
                                return _buildProjectCard(_recommendedProjects[index]);
                              },
                            ),
                          )
                              .animate()
                              .fadeIn(delay: 420.ms, duration: 450.ms)
                              .slideY(begin: 0.14, end: 0, curve: Curves.easeOutCubic),

                          const SizedBox(height: 28),

                          // Section: Alur Kerja Sistem
                          Text(
                            'Alur Kerja Sistem ProjectMatch',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.4,
                              color: AppColors.textHeadingLight,
                            ),
                          )
                              .animate()
                              .fadeIn(delay: 500.ms, duration: 420.ms)
                              .slideY(begin: 0.14, end: 0, curve: Curves.easeOutCubic),
                          const SizedBox(height: 4),
                          Text(
                            'Tanpa unggah PDF, data kompetensi ditarik otomatis',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11.5,
                              color: AppColors.textMuted,
                            ),
                          ).animate().fadeIn(delay: 520.ms, duration: 420.ms),

                          const SizedBox(height: 14),

                          _buildStepCard(
                            step: '01',
                            title: 'Tautkan GitHub Publik',
                            desc: 'Repositori diindeks otomatis ke arsitektur pgvector database.',
                            icon: LucideIcons.gitBranch,
                          )
                              .animate()
                              .fadeIn(delay: 580.ms, duration: 400.ms)
                              .slideY(begin: 0.14, end: 0),
                          const SizedBox(height: 10),
                          _buildStepCard(
                            step: '02',
                            title: 'Sintesis Radar 5-Dimensi',
                            desc: 'Model AI mengekstraksi tingkat kemahiran Python, TS, Cloud, dan ML.',
                            icon: LucideIcons.sparkles,
                          )
                              .animate()
                              .fadeIn(delay: 640.ms, duration: 400.ms)
                              .slideY(begin: 0.14, end: 0),
                          const SizedBox(height: 10),
                          _buildStepCard(
                            step: '03',
                            title: 'Pencocokan Semantik Otomatis',
                            desc: 'Lowongan mitra dicocokkan dengan akurasi semantik presisi tinggi.',
                            icon: LucideIcons.checkCircle2,
                          )
                              .animate()
                              .fadeIn(delay: 700.ms, duration: 400.ms)
                              .slideY(begin: 0.14, end: 0),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderStatChip({
    required IconData icon,
    required String value,
    required String label,
    required Color accent,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.primaryDarkDeep.withValues(alpha: 0.45),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.14)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 14, color: accent),
          const SizedBox(width: 7),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 9,
                    color: const Color(0xFFD2BBFF),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLiveAiMatchCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryDark.withValues(alpha: 0.06),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.accentLime,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'NEURAL MATCH ENGINE',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.4,
                        color: AppColors.primaryDark,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                'Sim 0.984',
                style: GoogleFonts.jetBrainsMono(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Match Score & Circular Ring
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Kecocokan Profil Anda',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        _isRecalculating ? '...' : _currentMatchScore.toStringAsFixed(1),
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 40,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -1.4,
                          color: AppColors.primaryDark,
                        ),
                      ),
                      Text(
                        '%',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.accentLimeDark,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const Spacer(),
              Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox(
                    width: 64,
                    height: 64,
                    child: CircularProgressIndicator(
                      value: _currentMatchScore / 100,
                      strokeWidth: 6,
                      backgroundColor: AppColors.bgLightSubtle,
                      valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accentLime),
                    ),
                  ),
                  const Icon(
                    LucideIcons.sparkles,
                    color: AppColors.primaryHeader,
                    size: 22,
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 10),
          Text(
            'Dievaluasi otomatis dari repositori GitHub publik terhadap kebutuhan mitra.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11.5,
              color: AppColors.textBodyLight,
              height: 1.4,
            ),
          ),

          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: List.generate(_categories.length, (index) {
              final cat = _categories[index];
              final isSelected = _selectedCategoryIndex == index;
              return GestureDetector(
                onTap: () => _onSelectCategory(index),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.primarySolid : AppColors.canvasLight,
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                      color: isSelected ? AppColors.accentLime : AppColors.borderLight,
                      width: 1.2,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(cat['icon'] as String, style: const TextStyle(fontSize: 12)),
                      const SizedBox(width: 5),
                      Text(
                        cat['name'] as String,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                          color: isSelected ? Colors.white : AppColors.textBodyLight,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectCard(Map<String, dynamic> project) {
    return Container(
      width: 266,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.bgLightSubtle,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    project['category'] as String,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textBodyLight,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.accentLime,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  '${project['match']}% Match',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFF0F172A),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            project['title'] as String,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13.5,
              fontWeight: FontWeight.w800,
              color: AppColors.textHeadingLight,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            project['company'] as String,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              color: AppColors.textMuted,
            ),
          ),
          const Spacer(),
          Wrap(
            spacing: 4,
            runSpacing: 4,
            children: (project['tags'] as List<String>).map((t) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  t,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primaryDark,
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  project['stipend'] as String,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.accentLimeDark,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                width: 28,
                height: 28,
                decoration: const BoxDecoration(
                  color: AppColors.primarySolid,
                  shape: BoxShape.circle,
                ),
                child: const Icon(LucideIcons.arrowRight, size: 14, color: Colors.white),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStepCard({
    required String step,
    required String title,
    required String desc,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Text(
              step,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12.5,
                fontWeight: FontWeight.w800,
                color: AppColors.primaryDark,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textHeadingLight,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  desc,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          Icon(icon, size: 16, color: AppColors.primaryHeader),
        ],
      ),
    );
  }
}
